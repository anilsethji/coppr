import * as yt from 'youtube-transcript';

const url = "https://youtube.com/shorts/I29peidTQxU?si=dKDYfoPNEbenKhY5";

async function test() {
    try {
        console.log("Exports:", Object.keys(yt));
        const YoutubeTranscript = yt.YoutubeTranscript || yt.default?.YoutubeTranscript;
        
        if (!YoutubeTranscript) {
            console.error("Could not find YoutubeTranscript in exports");
            return;
        }

        console.log("Fetching transcript...");
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        console.log("Transcript fetched:", transcript.length, "items");
    } catch (e) {
        console.error("Failed:", e.message || e);
    }
}

test();
