// prepare.js
Page({
  data: {
    countdown: 3,
    round: 1
  },
  countdownInterval: null,

  onLoad() {
    // Get the round number if continuing from results page
    const round = wx.getStorageSync('currentRound') || 1;
    this.setData({ round });
    
    // Start countdown
    this.startCountdown();
  },

  onUnload() {
    // Clear the interval when navigating away
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  },

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.data.countdown > 1) {
        this.setData({
          countdown: this.data.countdown - 1
        });
      } else {
        // Clear interval and navigate to game page
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
        
        wx.redirectTo({
          url: '/pages/game/game',
          fail: function(res) {
            console.error('Navigation to game page failed:', res);
          }
        });
      }
    }, 1000);
  }
}) 