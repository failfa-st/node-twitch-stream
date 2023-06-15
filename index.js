import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

import axios from "axios";
import { config } from "dotenv";

config();

/**
 * The RTMP URL for Twitch streaming.
 * Replace `TWITCH_STREAM_KEY` with your Twitch stream key.
 */
const rtmpUrl = `rtmp://live.twitch.tv/app/${process.env.TWITCH_STREAM_KEY}`;

/**
 * Starts the video streaming process using FFmpeg.
 * The video is looped indefinitely and streamed to Twitch.
 * @returns {Promise<void>} A promise that resolves when the streaming process ends.
 */
const startStreaming = () => {
	const videoPath = path.join(process.cwd(), "demo.mp4");

	return new Promise((resolve, reject) => {
		const ffmpegProcess = spawn("ffmpeg", [
			"-re", // Read input at the native frame rate
			"-hwaccel", // Specify hardware acceleration method
			"videotoolbox", // Use Video Toolbox for hardware acceleration
			"-stream_loop", // Loop the input indefinitely
			"-1", // Loop indefinitely
			"-i", // Specify the input file
			videoPath, // Path to the video file
			"-c:v", // Specify the video codec
			"libx264", // H.264 video codec
			"-pix_fmt", // Specify the pixel format
			"yuv420p", // YUV pixel format
			"-c:a", // Specify the audio codec
			"aac", // AAC audio codec
			"-f", // Specify the output format
			"flv", // Flash Video format
			rtmpUrl, // RTMP URL for Twitch streaming
		]);

		// Event handler for FFmpeg's stdout
		ffmpegProcess.stdout.on("data", data => {
			console.log(`ffmpeg stdout: ${data}`);
		});

		// Event handler for FFmpeg's stderr
		ffmpegProcess.stderr.on("data", data => {
			console.error(`ffmpeg stderr: ${data}`);
		});

		// Event handler for FFmpeg process error
		ffmpegProcess.on("error", err => {
			console.error("Error during streaming:", err);
			reject(err);
		});

		// Event handler for FFmpeg process exit
		ffmpegProcess.on("exit", code => {
			if (code === 0) {
				console.log("Stream ended.");
			} else {
				console.error(`ffmpeg exited with code ${code}`);
				reject(new Error(`ffmpeg exited with code ${code}`));
			}
		});

		// Event handler for FFmpeg process close
		ffmpegProcess.on("close", () => {
			console.log("Stream closed.");
			resolve();
		});
	});
};

/**
 * Authenticates with the Twitch API using client credentials.
 * Retrieves an access token required for streaming to Twitch.
 * @returns {Promise<void>} A promise that resolves when the authentication is successful.
 */
async function authenticateWithTwitchAPI() {
	// Retrieve Twitch client ID and client secret from environment variables
	const clientId = process.env.TWITCH_CLIENT_ID;
	const clientSecret = process.env.TWITCH_CLIENT_SECRET;

	try {
		// Send a POST request to Twitch API to obtain an access token
		const response = await axios.post(
			"https://id.twitch.tv/oauth2/token",
			new URLSearchParams({
				// Specify client ID, client secret, and grant type in the request body
				// eslint-disable-next-line camelcase
				client_id: clientId,
				// eslint-disable-next-line camelcase
				client_secret: clientSecret,
				// eslint-disable-next-line camelcase
				grant_type: "client_credentials",
			}),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

		// Extract the access token from the response data
		const { access_token: accessToken } = response.data;

		if (accessToken) {
			// If access token is retrieved, start the streaming process
			await startStreaming();
		} else {
			// If access token is not found in the response, log an error
			console.error(new Error("Access token not found in the response."));
		}
	} catch (error) {
		// If an error occurs during authentication, log the error and throw it
		console.error("Authentication error:", error);
		throw error;
	}
}

// Start the server and authenticate with Twitch API
authenticateWithTwitchAPI().catch(error => {
	console.error(error);
});
