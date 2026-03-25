import { useEffect, useMemo, useRef, useState } from 'react';
import { logEvent } from '../utils/eventLogger.jsx';

const hypeComments = [
  "This blew up fast!",
  "Subscribed immediately.",
  "Yo this editing though 🔥",
  "WHY is this not trending?",
  "More content please!",
  "Algorithm finally working!",
  "Bro you're famous now!",
  "This is top-tier content.",
  "Deserves way more views.",
  "OMG instant like.",
  "Saw this on trending.",
  "Day made, thanks!",
  "Better than Netflix.",
  "Real YouTube content here.",
  "My favorite channel now.",
  "This is why I love YouTube.",
  "Got recommended and not disappointed.",
  "The best editing I've seen.",
  "What a vibe.",
  "Your uploads never miss.",
  "First time here and I'm subbing.",
  "Let's get this to 1M views!",
  "Imagine disliking this.",
  "🔥🔥🔥🔥🔥",
  "How is this not viral yet?",
  "Found this randomly... love it.",
  "Content like this deserves trending.",
  "Shared this with my friends!",
  "Who else here before 1M views?",
  "Iconic content.",
  "Came for the title, stayed for the quality.",
  "Best part of my day.",
  "Algorithm blessed us today.",
  "This deserves way more recognition.",
  "This is criminally underrated.",
  "I can’t stop watching this.",
  "Came here from recommended.",
  "Why is this so addictive?",
  "Instant sub from me.",
  "You just gained a new fan.",
  "I watched this twice already.",
  "This editing is insane.",
  "The quality is unreal.",
  "YouTube finally recommended something good.",
  "I'm early and proud.",
  "Remember me when you're famous.",
  "This deserves millions of views.",
  "I laughed way too hard at this.",
  "This channel is going places.",
  "The algorithm knows what's up.",
  "One of the best videos I've seen today.",
  "This popped up at the perfect time.",
  "This deserves a million likes.",
  "Absolutely legendary content.",
  "This needs to blow up.",
  "How does this not have more views?",
  "Instant favorite video.",
  "YouTube recommendation W.",
  "Why is this so good?",
  "Just discovered this channel.",
  "I was not expecting this quality.",
  "This deserves to trend worldwide.",
  "YouTube needs to push this harder.",
  "Underrated masterpiece.",
  "You just earned a subscriber.",
  "Watching this at 3am lol.",
  "The algorithm chose well today.",
  "Certified banger.",
  "This goes hard.",
  "Low views but insane quality.",
  "The editing is clean.",
  "This deserves to explode.",
  "This video deserves the world.",
  "Absolute W video.",
  "This is peak content.",
  "Bro understood the assignment.",
  "No skips, all quality.",
  "Watching before it goes viral.",
  "I'm early gang.",
  "Can't believe this only has this many views.",
  "I’m calling it now, this will go viral.",
  "Came here before the million views.",
  "This is actually crazy good.",
  "I keep replaying this part.",
  "This video is a gem.",
  "YouTube needs to promote this.",
  "One of the best uploads today.",
  "The effort shows.",
  "This is insanely entertaining.",
  "How did I just discover this channel?",
  "The algorithm cooked with this one.",
  "This deserves way more love.",
  "I’m glad I clicked this.",
  "This is pure entertainment.",
  "High quality content right here.",
  "This channel deserves 1M subs.",
  "Finally something worth watching.",
  "I'm glad the algorithm showed me this.",
  "This is going to blow up soon.",
  "The internet needed this.",
  "This is peak YouTube.",
  "This is the content we want.",
  "Watching this again already.",
  "You deserve more recognition.",
  "Keep uploading like this.",
  "This channel is underrated.",
  "This deserves to trend.",
  "This video is addictive.",
  "One of the best things I’ve watched all week.",
  "YouTube algorithm actually worked for once.",
  "Came for curiosity, stayed for quality.",
  "This deserves awards.",
  "I wish more channels made content like this.",
  "This video made my day.",
  "This is seriously impressive.",
  "This video hits different.",
  "Absolutely loved this.",
  "Top tier content creator.",
  "This deserves to be everywhere.",
  "This channel is underrated AF.",
  "This video is elite.",
  "The vibes are immaculate.",
  "Who else found this randomly?",
  "Just discovered this masterpiece.",
  "I can't believe I almost skipped this.",
  "This is insanely good.",
  "This deserves way more hype.",
  "Straight up quality content.",
  "This video is a whole experience.",
  "Watching this again tomorrow.",
  "The effort is obvious.",
  "This is why I love YouTube.",
  "This deserves a standing ovation.",
  "The algorithm actually helped today.",
  "YouTube better not bury this.",
  "Content like this keeps me on the platform.",
  "This is peak internet.",
  "I'm recommending this to everyone.",
  "This deserves recognition.",
  "I can see this going viral.",
  "Best thing I've seen all day.",
  "YouTube gold right here.",
  "This needs to be everywhere.",
  "You nailed this one.",
  "Watching before the hype.",
  "I knew this would be good.",
  "YouTube algorithm W moment.",
  "This deserves more comments.",
  "This channel is going to blow up.",
  "This deserves the front page.",
  "This is ridiculously good.",
  "YouTube better push this.",
  "Absolutely phenomenal video.",
  "Straight up masterpiece.",
  "I can't stop watching this.",
  "This is next level.",
  "This video is unreal.",
  "Content like this wins the internet."
];

const earlyViewerComments = [
  "Early squad assemble.",
  "Here before this goes huge.",
  "Anyone else early?",
  "First 100k gang.",
  "I was here before the hype.",
  "Bookmarking this for when it blows up.",
  "Can't wait to come back when this has millions.",
  "I'm so early it hurts.",
  "Proof I was here first.",
  "Early comment for history books.",
  "Day one supporter right here.",
  "First time catching a future viral video this early.",
  "This is gonna age well.",
  "Leaving my mark before this explodes.",
  "Future me, congrats on finding this early.",
  "Here before the fake fame becomes real.",
  "Caught this before the masses did.",
  "This is pre-viral energy.",
  "Reporting live from before the algorithm spike.",
  "Small channel comments hit different."
];

const memeComments = [
  "Algorithm said yes.",
  "The CEO of YouTube needs to see this.",
  "This cured my scroll fatigue.",
  "My fyp and homepage are finally healing.",
  "This has no business being this good.",
  "Somebody hand this a trophy.",
  "This is dangerously rewatchable.",
  "I came, I watched, I subscribed.",
  "This slaps harder than it should.",
  "The edit demons were locked in.",
  "The sauce is immaculate.",
  "This is illegally underrated.",
  "The algorithm accidentally cooked.",
  "You dropped this 👑",
  "This feels like old YouTube in the best way.",
  "This deserves rent-free space in trending.",
  "Certified scroll stopper.",
  "This got me out of NPC mode.",
  "This is a 10/10 internet moment.",
  "That one friend who always finds fire content would send this."
];

const timestampStyleComments = [
  "0:12 that part was insane",
  "0:27 nah this is wild 😭",
  "0:41 replayed that like 5 times",
  "0:08 instant hook",
  "1:03 this goes crazy",
  "0:55 best part of the whole video",
  "0:18 the editing right there 🔥",
  "0:34 that's the moment I subscribed",
  "0:49 perfection",
  "0:22 this is where it got me",
  "0:15 I knew this was gonna be good",
  "0:38 broooo 😭",
  "0:57 how is this free content",
  "0:10 instant like",
  "0:29 cinema"
];

const botStyleComments = [
  "Promote it on sm for massive reach.",
  "Underrated creator alert.",
  "This deserves all the support.",
  "Sending support from another channel.",
  "Amazing upload keep it up.",
  "The world needs more creators like this.",
  "W content W creator.",
  "Here to support the grind.",
  "Big things coming for this channel.",
  "Hope this gets the recognition it deserves.",
  "This is seriously underappreciated.",
  "Dropping support before this takes off.",
  "Respect for the consistency.",
  "Such a strong upload.",
  "Love the energy in this video."
];

const viewerReactionComments = [
  "I clicked for a second and stayed for the whole thing.",
  "This is one of those videos you accidentally watch twice.",
  "I don't even know how I got here but I'm staying.",
  "This genuinely made my day better.",
  "I was about to leave the app and then this showed up.",
  "This stopped my doomscroll immediately.",
  "I needed this today.",
  "This feels weirdly high effort in the best way.",
  "Now this is content.",
  "This deserves a way bigger audience.",
  "It’s rare to find something this watchable.",
  "I usually never comment but this earned one.",
  "Okay yeah this was worth the click.",
  "I actually smiled watching this.",
  "This is the kind of video that makes me subscribe instantly.",
  "This has replay value for sure.",
  "This hit way harder than expected.",
  "I didn't expect to enjoy this this much.",
  "This deserves to be recommended to everyone.",
  "No joke this is quality."
];

const spammyComments = [
  "Who else watching right now??",
  "Anyone here in 2026?",
  "Why does this only have this many views???",
  "Can we appreciate the effort?",
  "People sleeping on this channel fr.",
  "This deserves more attention ASAP.",
  "The algorithm is late but not wrong.",
  "Can we all agree this is fire?",
  "The comments passed the vibe check.",
  "Just wait until this gets discovered.",
  "I smell viral potential.",
  "This is hidden gem territory.",
  "This deserves to be on the front page.",
  "Not enough people are talking about this.",
  "Why am I only seeing this now?"
];

const firstNames = [
  "Jake", "Luna", "Ethan", "Ava", "Noah", "Mia", "Kai", "Zane", "Liam", "Emma",
  "Mason", "Sophia", "Logan", "Chloe", "Dylan", "Harper", "Jaxon", "Nora", "Leo", "Skye",
  "Ryder", "Layla", "Owen", "Zoey", "Asher", "Nova", "Hudson", "Ruby", "Ezra", "Ivy",
  "Carter", "Mila", "Roman", "Sadie", "Blake", "Aria", "Axel", "Stella", "Theo", "Violet"
];

const userSuffixes = [
  "TV", "YT", "Live", "Clips", "Edits", "Zone", "HQ", "Media", "Studio", "Official",
  "Fan", "Archive", "Central", "Nation", "Hub", "Vids", "Wave", "Plug", "Daily", "World"
];

const handleWords = [
  "trend", "viral", "pixel", "ghost", "hyper", "nova", "clip", "edit", "glitch", "echo",
  "boost", "shadow", "alpha", "omega", "vibe", "signal", "reel", "orbit", "flash", "wave",
  "hype", "daily", "prime", "scope", "zone", "fusion", "scroll", "static", "byte", "drift"
];

const avatarPool = ["👤", "😎", "🔥", "🎬", "📺", "🚀", "💬", "⚡", "🌀", "🎮", "🧠", "👑", "📈", "💯"];

const fakeComments = [
  ...hypeComments,
  ...earlyViewerComments,
  ...memeComments,
  ...timestampStyleComments,
  ...botStyleComments,
  ...viewerReactionComments,
  ...spammyComments
];

const MAX_VISIBLE_COMMENTS = 250;

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomComment(pool, lastCommentRef) {
  if (!pool.length) return "Nice video.";

  let next = getRandomItem(pool);

  if (pool.length > 1) {
    let safety = 0;
    while (next === lastCommentRef.current && safety < 10) {
      next = getRandomItem(pool);
      safety += 1;
    }
  }

  lastCommentRef.current = next;
  return next;
}

function generateFakeUsername() {
  const name = getRandomItem(firstNames);
  const maybeSuffix = Math.random() > 0.55 ? getRandomItem(userSuffixes) : "";
  const maybeNumber = Math.random() > 0.45 ? Math.floor(Math.random() * 9999) : "";
  return `${name}${maybeSuffix}${maybeNumber}`;
}

function generateFakeHandle() {
  const word1 = getRandomItem(handleWords);
  const word2 = Math.random() > 0.5 ? getRandomItem(handleWords) : "";
  const num = Math.random() > 0.4 ? Math.floor(Math.random() * 9999) : "";
  return `@${word1}${word2}${num}`;
}

function formatFakeAge(secondsAgo) {
  if (secondsAgo <= 2) return "just now";
  if (secondsAgo < 60) return `${secondsAgo} sec ago`;

  const minutes = Math.floor(secondsAgo / 60);
  if (minutes === 1) return "1 min ago";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hr ago";
  return `${hours} hr ago`;
}

function createFakeComment(commentText) {
  const secondsAgo = Math.floor(Math.random() * 25) + 1;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 6)}`,
    user: generateFakeUsername(),
    handle: generateFakeHandle(),
    avatar: getRandomItem(avatarPool),
    text: commentText,
    age: formatFakeAge(secondsAgo),
    likes: Math.random() > 0.65 ? Math.floor(Math.random() * 900) + 1 : 0
  };
}

export default function CommentFeed({
  running,
  speed,
  commentsPaused = false,
  botRaidCount = 0,
  totalCommentCount = null,
  resetTrigger = 0,
  onBotRaidComplete = () => {},
  onNewComment = () => {}
}) {
  const [comments, setComments] = useState([]);
  const lastCommentRef = useRef(null);
  const onNewCommentRef = useRef(onNewComment);

  useEffect(() => {
    setComments([]);
    lastCommentRef.current = null;
  }, [resetTrigger]);

  useEffect(() => {
    onNewCommentRef.current = onNewComment;
  }, [onNewComment]);

  const adjustedInterval = useMemo(() => {
    return Math.max(5000 / Math.max(speed || 0.01, 0.01), 200);
  }, [speed]);

  useEffect(() => {
    if (!running || commentsPaused || speed <= 0) return;

    const interval = setInterval(() => {
      const newCommentText = getRandomComment(fakeComments, lastCommentRef);
      const newComment = createFakeComment(newCommentText);

      setComments((prev) => [newComment, ...prev].slice(0, MAX_VISIBLE_COMMENTS));
      onNewCommentRef.current(newComment);
    }, adjustedInterval);

    return () => clearInterval(interval);
  }, [running, commentsPaused, speed, adjustedInterval]);

  useEffect(() => {
    if (!botRaidCount || botRaidCount <= 0) return;

    const raidComments = Array.from({ length: botRaidCount }, () => {
      const newCommentText = getRandomComment(fakeComments, lastCommentRef);
      return createFakeComment(newCommentText);
    });

    setComments((prev) => [...raidComments, ...prev].slice(0, MAX_VISIBLE_COMMENTS));

    for (let i = 0; i < botRaidCount; i += 1) {
      onNewCommentRef.current();
    }

    onBotRaidComplete();
  }, [botRaidCount, onBotRaidComplete]);

  const displayedCommentCount =
    totalCommentCount !== null ? totalCommentCount : comments.length;

  return (
    <div>
      <h3 className="comments-heading">
        Comments ({displayedCommentCount.toLocaleString()})
      </h3>

      <div className="comment-feed">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <span className="comment-avatar">{comment.avatar}</span>
              <span className="comment-user">{comment.user}</span>
              <span className="comment-handle">{comment.handle}</span>
              <span className="comment-age">{comment.age}</span>
            </div>

            <div className="comment-body">💬 {comment.text}</div>

            <div className="comment-meta">
              {comment.likes > 0 ? <span>👍 {comment.likes.toLocaleString()}</span> : <span>👍 0</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}