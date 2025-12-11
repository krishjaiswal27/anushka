# Quick Customization Guide 🎨

## How to Personalize Your Website

### 1. Change the Main Title
Edit `index.html` line 21:
```html
<h1 class="title-main">Your Title Here</h1>
```

### 2. Add More Secrets
Edit `letters.js` - add entries to the `letters` array:
```javascript
{
  id: 4,
  day: 4,
  title: "Your Secret Title",
  content: `Your secret message here...`,
  color: "gradient-1",
  secretType: "puzzle" // or "memory" or "password"
}
```

### 3. Change Word Puzzle Answers
Edit `letters.js` in `wordPuzzles`:
```javascript
4: { word: "YOURWORD", hint: "your hint here" }
```

### 4. Add Photos to Gallery
1. Place image files in the `photos/` folder
2. Edit `letters.js` in the `gallery` array:
```javascript
{ id: 'photo6', src: './photos/yourphoto.jpg', alt: 'Description', caption: 'Date or note' }
```

### 5. Change Colors & Theme
Main color variables in `style.css`:
- Pink/Red: `#ec4899`, `#f43f5e`
- Purple: `#8b5cf6`
- Update the gradient colors throughout the file

### 6. Customize Memory Game
Edit `memory.js`:
- Change the `images` array for different emoji
- Adjust `targetMatches` for difficulty
- Customize colors in the `.memory-card` CSS

### 7. Change Password-Protected Secret
Edit `letters.js`:
```javascript
{
  id: 3,
  secretType: "password",
  password: "YOUR_PASSWORD"
}
```

## Tips for Best Results

✅ Keep secret text concise but meaningful
✅ Use emojis for visual interest
✅ Test all game features before sharing
✅ Make sure all photos are optimized for web
✅ Remember passwords are case-insensitive

## Features Explained

🎮 **Puzzle Mode** - Wordle-style word guessing
🎮 **Memory Mode** - Match pairs game
🔒 **Password Mode** - Direct password unlock

## Troubleshooting

❌ Photos not showing?
- Check file names match exactly (case-sensitive)
- Ensure photos are in the `photos/` folder

❌ Game not working?
- Check browser console for errors (F12)
- Make sure all files are saved

❌ Styling looks off?
- Clear browser cache (Ctrl+Shift+Delete)
- Try a different browser

## File Structure
```
anushka/
├── index.html          (Main page)
├── style.css           (All styling - recently upgraded!)
├── play.js             (Main game logic)
├── memory.js           (Memory game)
├── letters.js          (Your content)
├── photos/             (Your images)
└── IMPROVEMENTS.md     (Change log)
```

Happy customizing! 💕
