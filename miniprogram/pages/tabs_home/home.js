// pages/tabs_home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onLoadData();
  },

  onGetFile() {
    const { list } = this.data;
    if (list.length > 0) {
      Promise.all(
        list.map(i => {
          return wx.cloud.downloadFile({ fileID: i.fileId }).then(item => {
            return item.tempFilePath;
          }).catch(err => {
            console.log('下载失败:', err.message)
          })
        })
      ).then(item => {
        this.setData({ list: item.map((i, index) => ({ ...list[index], fileUrl: i })) });
      });
    }
  },

  onLoadData: function () {
    wx.showLoading({
      title: '加载中',
    })
    const db = wx.cloud.database();
    db.collection('userInfo').get({
      success: res => {
        this.setData({ list: res.data }, this.onGetFile);
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    });
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },

  onUpdateUser: options => {
    const { item } = options.currentTarget.dataset;
    wx.navigateTo({
      url: `../user/addForm?_id=${item._id}&name=${item.name}&age=${item.age}&fileUrl=${item.fileUrl}`,
    });
  },

  onRemoveUser: function (options) {
    const { item } = options.currentTarget.dataset;
    wx.showModal({
      title: '提示',
      content: `确认删除${item.name}?`,
      success (res) {
        if (res.confirm) {
          remove();
        } else if (res.cancel) {
          return;
        }
      }
    });
    const remove = () => {
      const db = wx.cloud.database();
      db.collection('userInfo').doc(item._id).remove({
        success: res => {
          this.onLoadData();
          wx.showToast({
            title: '删除成功',
          });
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
        }
      })
    };
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})