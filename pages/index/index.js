// index.js
Page({
  data: {
    categories: ['基础词库', '影视词库', '成语词库', '游戏词库'],
    categoryIndex: 0,
    showRulesModal: false
  },

  onLoad() {
    // Check if there's a saved category preference
    const categoryIndex = wx.getStorageSync('categoryIndex');
    if (categoryIndex !== '') {
      this.setData({
        categoryIndex
      });
    }
  },

  onCategoryChange(e) {
    const categoryIndex = e.detail.value;
    this.setData({
      categoryIndex
    });
    wx.setStorageSync('categoryIndex', categoryIndex);
  },

  startGame() {
    console.log('Start game button clicked');
    // Save selected category to global data or storage
    const selectedCategory = this.data.categories[this.data.categoryIndex];
    wx.setStorageSync('selectedCategory', selectedCategory);
    
    // Navigate to the prepare page
    wx.redirectTo({
      url: '/pages/prepare/prepare',
      fail: function(res) {
        console.error('Navigation failed:', res);
      }
    });
  },

  showRules() {
    console.log('Show rules button clicked');
    this.setData({
      showRulesModal: true
    });
  },

  closeRules() {
    this.setData({
      showRulesModal: false
    });
  },
  
  // Prevent bubbling for modal content
  stopPropagation(e) {
    // This prevents the event from bubbling to the modal background
    return;
  }
})
