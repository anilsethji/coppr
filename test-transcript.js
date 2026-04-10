import { YoutubeTranscript } from 'youtube-transcript';

const url = "https://youtube.com/shorts/I29peidTQxU?si=dKDYfoPNEbenKhY5";

async function test() {
    try {
        console.log("Fetching transcript...");
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        console.log("Transcript fetched:", transcript.length, "items");
        console.log("Text preview:", transcript.slice(0, 3).map(t => t.text).join(" "));
    } catch (e) {
        console.error("Failed:", e.message || e);
    }
}

test();
