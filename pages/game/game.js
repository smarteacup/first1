// game.js
Page({
  data: {
    gameTime: 60, // Game time in seconds
    currentWord: '',
    score: 0,
    correctWords: [],
    skippedWords: [],
    timeLeft: 60,
    isUrgent: false,
    round: 1,
    showCorrectFeedback: false,
    showSkipFeedback: false,
    words: [
      // 基础词库
      ["苹果", "香蕉", "西瓜", "橙子", "猫", "狗", "老虎", "大象", "电视", "手机", 
       "电脑", "冰箱", "汽车", "飞机", "火车", "自行车", "书", "笔", "纸", "桌子"],
      // 影视词库
      ["蜘蛛侠", "钢铁侠", "哈利波特", "星球大战", "泰坦尼克号", "复仇者联盟", 
       "阿凡达", "指环王", "功夫熊猫", "冰雪奇缘", "狮子王", "疯狂动物城"],
      // 成语词库
      ["一石二鸟", "画蛇添足", "守株待兔", "亡羊补牢", "叶公好龙", "盲人摸象", 
       "狐假虎威", "掩耳盗铃", "滥竽充数", "画龙点睛", "对牛弹琴", "望梅止渴"],
      // 游戏词库
      ["英雄联盟", "王者荣耀", "绝地求生", "我的世界", "魔兽世界", "守望先锋", 
       "原神", "地下城与勇士", "穿越火线", "第五人格", "和平精英", "超级马里奥"]
    ]
  },
  gameTimer: null,
  feedbackTimer: null,

  onLoad() {
    // Get the round number
    const round = wx.getStorageSync('currentRound') || 1;
    
    // Get selected category
    const categoryIndex = wx.getStorageSync('categoryIndex') || 0;
    
    this.setData({ 
      round,
      categoryIndex
    });
    
    // Get a new word
    this.getNewWord();
    
    // Start the game timer
    this.startTimer();
    
    // Enable haptic feedback if available
    if (wx.vibrateShort) {
      this.canVibrate = true;
    }
  },

  onUnload() {
    // Clear the timer when navigating away
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
  },

  startTimer() {
    this.gameTimer = setInterval(() => {
      if (this.data.timeLeft > 1) {
        let isUrgent = this.data.timeLeft <= 10;
        this.setData({
          timeLeft: this.data.timeLeft - 1,
          isUrgent
        });
      } else {
        // Time's up, end the game
        clearInterval(this.gameTimer);
        this.gameTimer = null;
        this.endGame();
      }
    }, 1000);
  },

  getNewWord() {
    const wordList = this.data.words[this.data.categoryIndex];
    // Get a random word that hasn't been used yet
    const usedWords = [...this.data.correctWords, ...this.data.skippedWords];
    
    // Filter out words that have been used
    const availableWords = wordList.filter(word => !usedWords.includes(word));
    
    if (availableWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      this.setData({
        currentWord: availableWords[randomIndex]
      });
    } else {
      // If all words are used, end the game
      this.endGame();
    }
  },

  onCorrect() {
    // Provide haptic feedback
    if (this.canVibrate) {
      wx.vibrateShort({
        type: 'medium'
      });
    }
    
    // Show visual feedback
    this.setData({
      showCorrectFeedback: true
    });
    
    // Clear previous feedback timer
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
    
    // Hide feedback after a short period
    this.feedbackTimer = setTimeout(() => {
      this.setData({
        showCorrectFeedback: false
      });
    }, 300);
    
    // Add current word to correct words list
    const correctWords = [...this.data.correctWords, this.data.currentWord];
    this.setData({
      correctWords,
      score: this.data.score + 1
    });
    
    // Get a new word
    this.getNewWord();
  },

  onSkip() {
    // Provide haptic feedback
    if (this.canVibrate) {
      wx.vibrateShort({
        type: 'medium'
      });
    }
    
    // Show visual feedback
    this.setData({
      showSkipFeedback: true
    });
    
    // Clear previous feedback timer
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
    
    // Hide feedback after a short period
    this.feedbackTimer = setTimeout(() => {
      this.setData({
        showSkipFeedback: false
      });
    }, 300);
    
    // Add current word to skipped words list
    const skippedWords = [...this.data.skippedWords, this.data.currentWord];
    this.setData({
      skippedWords
    });
    
    // Get a new word
    this.getNewWord();
  },

  endGame() {
    // Clear the timer if it's still running
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
    
    // Save game results to storage
    wx.setStorageSync('gameScore', this.data.score);
    wx.setStorageSync('correctWords', this.data.correctWords);
    wx.setStorageSync('skippedWords', this.data.skippedWords);
    wx.setStorageSync('currentRound', this.data.round + 1);
    
    // Navigate to results page
    wx.redirectTo({
      url: '/pages/result/result',
      fail: function(res) {
        console.error('Navigation to result page failed:', res);
      }
    });
  }
}) 