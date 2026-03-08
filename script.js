// Music recommendations database
const musicDatabase = {
    happy: [
        { title: "Don't Stop Me Now", artist: "Queen", type: "Song" },
        { title: "Walking on Sunshine", artist: "Katrina & The Waves", type: "Song" },
        { title: "Good as Hell", artist: "Lizzo", type: "Song" },
        { title: "Best Day of My Life", artist: "American Authors", type: "Song" },
        { title: "Levitating", artist: "Dua Lipa", type: "Song" },
        { title: "Feel Good Hits", artist: "Spotify", type: "Playlist" }
    ],
    excited: [
        { title: "Thunderstruck", artist: "AC/DC", type: "Song" },
        { title: "Eye of the Tiger", artist: "Survivor", type: "Song" },
        { title: "Blinding Lights", artist: "The Weeknd", type: "Song" },
        { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", type: "Song" },
        { title: "Pump It Up", artist: "Endor", type: "Song" },
        { title: "Party Bangers", artist: "Spotify", type: "Playlist" }
    ],
    tired: [
        { title: "Someone Like You", artist: "Adele", type: "Song" },
        { title: "Skinny Love", artist: "Bon Iver", type: "Song" },
        { title: "Sunset Lover", artist: "Petit Biscuit", type: "Song" },
        { title: "Holocene", artist: "Bon Iver", type: "Song" },
        { title: "Golden Hour", artist: "JVKE", type: "Song" },
        { title: "Peaceful Piano", artist: "Spotify", type: "Playlist" }
    ],
    stressed: [
        { title: "Weightless", artist: "Marconi Union", type: "Song" },
        { title: "Calm Down", artist: "Rema & Selena Gomez", type: "Song" },
        { title: "Let It Go", artist: "James Bay", type: "Song" },
        { title: "Breathe", artist: "The Prodigy", type: "Song" },
        { title: "Nuvole Bianche", artist: "Ludovico Einaudi", type: "Song" },
        { title: "Sleep & Meditation", artist: "Spotify", type: "Playlist" }
    ]
};

// State management
let selectedMood = null;
let moodHistory = [];

// Initialize app
function init() {
    loadMoodHistory();
    setupEventListeners();
    renderMoodHistory();
    renderMoodStats();
}

// Setup event listeners
function setupEventListeners() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    const logMoodBtn = document.getElementById('logMoodBtn');

    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => selectMood(btn));
    });

    logMoodBtn.addEventListener('click', logMood);
}

// Select mood
function selectMood(btn) {
    // Remove active class from all buttons
    document.querySelectorAll('.mood-btn').forEach(b => {
        b.classList.remove('active');
    });

    // Add active class to clicked button
    btn.classList.add('active');
    selectedMood = btn.dataset.mood;
}

// Log mood and show recommendations
function logMood() {
    if (!selectedMood) {
        alert('Please select a mood first');
        return;
    }

    const timestamp = new Date();
    const moodEntry = {
        mood: selectedMood,
        timestamp: timestamp.toISOString()
    };

    moodHistory.unshift(moodEntry);
    saveMoodHistory();

    // Show recommendations
    showRecommendations(selectedMood);

    // Update UI
    renderMoodHistory();
    renderMoodStats();

    // Reset selection
    document.querySelectorAll('.mood-btn').forEach(b => {
        b.classList.remove('active');
    });
    selectedMood = null;
}

// Show music recommendations
function showRecommendations(mood) {
    const recommendations = musicDatabase[mood];
    const container = document.getElementById('recommendations');

    container.innerHTML = '';

    recommendations.forEach((rec, index) => {
        const div = document.createElement('div');
        div.className = 'recommendation-item';
        div.style.animationDelay = `${index * 0.1}s`;
        
        const moodEmoji = getMoodEmoji(mood);
        div.innerHTML = `
            <div class="rec-title">${rec.title}</div>
            <div class="rec-artist">${rec.artist}</div>
            <span class="rec-type">${rec.type}</span>
        `;
        
        container.appendChild(div);
    });
}

// Render mood history
function renderMoodHistory() {
    const historyGrid = document.getElementById('historyGrid');

    if (moodHistory.length === 0) {
        historyGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">📝</div>
                <p>No mood logs yet. Start by logging your current mood!</p>
            </div>
        `;
        return;
    }

    // Show last 10 entries
    const recentHistory = moodHistory.slice(0, 10);
    historyGrid.innerHTML = '';

    recentHistory.forEach((entry, index) => {
        const date = new Date(entry.timestamp);
        const timeString = formatTime(date);
        const moodEmoji = getMoodEmoji(entry.mood);
        const moodLabel = entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1);

        const div = document.createElement('div');
        div.className = 'history-item';
        div.style.animationDelay = `${index * 0.05}s`;
        div.innerHTML = `
            <div class="history-mood">${moodEmoji}</div>
            <div class="history-time">${timeString}</div>
            <div class="history-label">${moodLabel}</div>
        `;

        historyGrid.appendChild(div);
    });
}

// Render mood statistics
function renderMoodStats() {
    const moodStats = document.getElementById('moodStats');

    if (moodHistory.length === 0) {
        moodStats.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">📈</div>
                <p>Log your moods to see insights and patterns</p>
            </div>
        `;
        return;
    }

    // Calculate mood counts
    const moodCounts = {
        happy: 0,
        excited: 0,
        tired: 0,
        stressed: 0
    };

    moodHistory.forEach(entry => {
        moodCounts[entry.mood]++;
    });

    moodStats.innerHTML = '';

    Object.entries(moodCounts).forEach(([mood, count]) => {
        const emoji = getMoodEmoji(mood);
        const label = mood.charAt(0).toUpperCase() + mood.slice(1);
        const percentage = ((count / moodHistory.length) * 100).toFixed(0);

        const div = document.createElement('div');
        div.className = 'stat-card';
        div.innerHTML = `
            <div class="stat-mood">${emoji}</div>
            <div class="stat-count">${count}</div>
            <div class="stat-label">${label}</div>
            <div style="font-size: 0.8rem; color: #0369a1; margin-top: 4px;">${percentage}%</div>
        `;

        moodStats.appendChild(div);
    });
}

// Get mood emoji
function getMoodEmoji(mood) {
    const emojiMap = {
        happy: '😊',
        excited: '🤩',
        tired: '😴',
        stressed: '😰'
    };
    return emojiMap[mood] || '😊';
}

// Format time for display
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// LocalStorage management
function saveMoodHistory() {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
}

function loadMoodHistory() {
    const stored = localStorage.getItem('moodHistory');
    moodHistory = stored ? JSON.parse(stored) : [];
}

// Initialize app on load
document.addEventListener('DOMContentLoaded', init);