import { useEffect, useState } from 'react';

const fakeComments = [
  "This blew up fast!", "Subscribed immediately.", "Yo this editing though 🔥",
  "WHY is this not trending?", "More content please!", "Algorithm finally working!",
  "Bro you're famous now!", "This is top-tier content.", "Deserves way more views.",
  "OMG instant like.", "Saw this on trending.", "Day made, thanks!", "Better than Netflix.",
  "Real YouTube content here.", "My favorite channel now.", "This is why I love YouTube.",
  "Got recommended and not disappointed.", "The best editing I've seen.", "What a vibe.",
  "Your uploads never miss.", "First time here and I'm subbing.", "Let's get this to 1M views!",
  "Imagine disliking this.", "🔥🔥🔥🔥🔥", "How is this not viral yet?",
  "Found this randomly... love it.", "Content like this deserves trending.",
  "Shared this with my friends!", "Who else here before 1M views?", "Iconic content.",
  "Came for the title, stayed for the quality.", "Best part of my day."
];

export default function CommentFeed({ running, speed, onNewComment }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!running) return;

    const adjustedInterval = Math.max(5000 / Math.max(speed, 0.01), 200);

    const interval = setInterval(() => {
      if (speed > 0) {
        const newComment = fakeComments[Math.floor(Math.random() * fakeComments.length)];
        setComments(prev => [newComment, ...prev]);
        onNewComment();    // ✅ Notify parent of new comment

      }
    }, adjustedInterval);

    return () => clearInterval(interval);

  }, [running, speed]);

  return (
    <div>
      <h3 className="comments-heading">
        Comments ({comments.length.toLocaleString()})
      </h3>

      <div className="comment-feed">
        {comments.map((comment, idx) => (
          <div key={idx} className="comment">💬 {comment}</div>
        ))}
      </div>
    </div>
  );
}
