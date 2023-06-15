# node-twitch-stream

`node-twitch-stream` is a Node.js application that allows you to stream a video file to Twitch using
the Twitch API and FFmpeg.

## Prerequisites

Before running the application, make sure you have the following prerequisites installed:

-   Node.js (version 14 or higher)
-   FFmpeg (installed and accessible via the command line)
-   Twitch account with stream key

## Installation

1. Clone the repository:

```shell
git clone https://github.com/failfa-st/node-twitch-stream.git
```

2. Navigate to the project directory:

```shell
cd node-twitch-stream
```

3. Install the dependencies:

```shell
npm install
```

4. Create a `.env` file in the project root directory and add the following environment variables:

```
TWITCH_CLIENT_ID=your-twitch-client-id
TWITCH_CLIENT_SECRET=your-twitch-client-secret
TWITCH_STREAM_KEY=your-twitch-stream-key
```

> 💡 You can copy the `.env.example` to `.env`

Replace your-twitch-client-id, your-twitch-client-secret, and your-twitch-stream-key with your
actual Twitch credentials.

5. Add a file `demo.mp4` to the project: `path/to/node-twitch-stream/demo.mp4`

## Usage

To start the streaming process, run the following command:

```shell
npm start
```

The application will authenticate with the Twitch API using the provided client credentials,
retrieve an access token, and initiate the streaming of the video file `demo.mp4` to Twitch.

## Customization

You can customize the video file to be streamed by replacing demo2.mp4 in the startStreaming
function of index.js with the path to your desired video file.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open
an issue or submit a pull request.
