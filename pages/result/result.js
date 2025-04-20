// result.js
Page({
  data: {
    score: 0,
    correctWords: [],
    skippedWords: []
  },

  onLoad() {
    // Get game results from storage
    const score = wx.getStorageSync('gameScore') || 0;
    const correctWords = wx.getStorageSync('correctWords') || [];
    const skippedWords = wx.getStorageSync('skippedWords') || [];
    
    this.setData({
      score,
      correctWords,
      skippedWords
    });
  },

  onNextRound() {
    // Navigate to the prepare page for the next round
    wx.redirectTo({
      url: '/pages/prepare/prepare',
      fail: function(res) {
        console.error('Navigation to prepare page failed:', res);
      }
    });
  },

  onHome() {
    // Reset round count
    wx.setStorageSync('currentRound', 1);
    
    // Navigate back to home page
    wx.reLaunch({
      url: '/pages/index/index',
      fail: function(res) {
        console.error('Navigation to home page failed:', res);
      }
    });
  },

  onShareAppMessage() {
    return {
      title: `我在疯狂猜词中猜对了${this.data.score}个词！来挑战我吧！`,
      path: '/pages/index/index'
    };
  }
}) 