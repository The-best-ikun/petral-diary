// Petal Diary - 留言系统功能

class CommentManager {
  constructor() {
    this.storageKey = 'petal-diary-comments';
    this.comments = [];
    this.init();
  }

  init() {
    this.loadComments();
    this.setupEventListeners();
    this.renderComments();
  }

  // 加载留言数据
  loadComments() {
    const savedComments = localStorage.getItem(this.storageKey);
    if (savedComments) {
      this.comments = JSON.parse(savedComments);
    } else {
      // 初始化一些示例数据
      this.comments = [
        {
          id: this.generateId(),
          author: '小花仙子',
          content: '这个网站好可爱啊！💖',
          timestamp: new Date('2024-01-15T10:30:00').toISOString(),
          parentId: null,
          replies: [
            {
              id: this.generateId(),
              author: '彩虹糖',
              content: '同意！特别喜欢樱花粉的主题 🌸',
              timestamp: new Date('2024-01-15T11:15:00').toISOString(),
              parentId: '1'
            }
          ]
        },
        {
          id: this.generateId(),
          author: '小兔子',
          content: '芒果千层蛋糕看起来好好吃！想学做 🥭',
          timestamp: new Date('2024-01-14T15:20:00').toISOString(),
          parentId: null,
          replies: []
        }
      ];
      this.saveComments();
    }
  }

  // 保存留言数据
  saveComments() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.comments));
  }

  // 生成唯一ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 格式化时间
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // 小于1分钟
    if (diff < 60000) {
      return '刚刚';
    }
    
    // 小于1小时
    if (diff < 3600000) {
      return Math.floor(diff / 60000) + '分钟前';
    }
    
    // 小于1天
    if (diff < 86400000) {
      return Math.floor(diff / 3600000) + '小时前';
    }
    
    // 小于30天
    if (diff < 2592000000) {
      return Math.floor(diff / 86400000) + '天前';
    }
    
    // 超过30天显示具体日期
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // 添加新留言
  addComment(author, content, parentId = null) {
    if (!author.trim() || !content.trim()) {
      this.showMessage('请填写昵称和留言内容～', 'error');
      return false;
    }

    const newComment = {
      id: this.generateId(),
      author: author.trim(),
      content: content.trim(),
      timestamp: new Date().toISOString(),
      parentId: parentId
    };

    if (parentId) {
      // 添加回复
      const parentComment = this.findComment(parentId);
      if (parentComment) {
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(newComment);
      }
    } else {
      // 添加顶级留言
      this.comments.unshift(newComment);
    }

    this.saveComments();
    this.renderComments();
    this.showMessage('留言成功！💕', 'success');
    return true;
  }

  // 查找留言
  findComment(commentId) {
    for (const comment of this.comments) {
      if (comment.id === commentId) {
        return comment;
      }
      if (comment.replies) {
        for (const reply of comment.replies) {
          if (reply.id === commentId) {
            return reply;
          }
        }
      }
    }
    return null;
  }

  // 删除留言（管理员功能，这里只是预留）
  deleteComment(commentId) {
    // 这里可以添加删除功能，但暂时不需要
    console.log('删除留言:', commentId);
  }

  // 渲染留言列表
  renderComments() {
    const commentsContainer = document.getElementById('comments-list');
    if (!commentsContainer) return;

    if (this.comments.length === 0) {
      commentsContainer.innerHTML = `
        <div class="no-comments">
          <div class="no-comments-icon">📝</div>
          <p>还没有留言，来说点什么吧～</p>
        </div>
      `;
      return;
    }

    let html = '';
    this.comments.forEach(comment => {
      html += this.renderCommentThread(comment);
    });

    commentsContainer.innerHTML = html;
    this.attachCommentEvents();
  }

  // 渲染留言线程（包含回复）
  renderCommentThread(comment, isReply = false) {
    const commentHtml = this.renderComment(comment, isReply);
    const repliesHtml = comment.replies && comment.replies.length > 0 
      ? `<div class="comment-replies">
          ${comment.replies.map(reply => this.renderCommentThread(reply, true)).join('')}
        </div>`
      : '';

    return `
      <div class="comment-thread ${isReply ? 'comment-thread-reply' : ''}">
        ${commentHtml}
        ${repliesHtml}
      </div>
    `;
  }

  // 渲染单条留言
  renderComment(comment, isReply = false) {
    return `
      <div class="comment ${isReply ? 'comment-reply' : ''}" data-comment-id="${comment.id}">
        <div class="comment-avatar">
          ${this.getAvatarEmoji(comment.author)}
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">${this.escapeHtml(comment.author)}</span>
            <span class="comment-time">${this.formatDate(comment.timestamp)}</span>
          </div>
          <div class="comment-text">${this.escapeHtml(comment.content)}</div>
          <div class="comment-actions">
            <button class="comment-reply-btn" data-comment-id="${comment.id}">
              <span class="reply-icon">💬</span>
              回复
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 获取头像emoji
  getAvatarEmoji(author) {
    const emojis = ['🌸', '🌷', '🌹', '🌺', '🌼', '💖', '🦋', '🐰', '🐱', '🧚‍♀️'];
    let hash = 0;
    for (let i = 0; i < author.length; i++) {
      hash = author.charCodeAt(i) + ((hash << 5) - hash);
    }
    return emojis[Math.abs(hash) % emojis.length];
  }

  // HTML转义
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 设置事件监听器
  setupEventListeners() {
    // 留言表单提交
    const form = document.getElementById('comment-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }
  }

  // 处理表单提交
  handleFormSubmit() {
    const authorInput = document.getElementById('comment-author');
    const contentInput = document.getElementById('comment-content');
    const parentInput = document.getElementById('reply-to-id');

    const author = authorInput.value;
    const content = contentInput.value;
    const parentId = parentInput ? parentInput.value : null;

    if (this.addComment(author, content, parentId)) {
      // 清空表单
      authorInput.value = '';
      contentInput.value = '';
      if (parentInput) {
        parentInput.value = '';
        this.hideReplyForm();
      }
    }
  }

  // 绑定留言事件
  attachCommentEvents() {
    // 回复按钮事件
    const replyButtons = document.querySelectorAll('.comment-reply-btn');
    replyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const commentId = button.dataset.commentId;
        this.showReplyForm(commentId);
      });
    });
  }

  // 显示回复表单
  showReplyForm(parentId) {
    // 隐藏之前的回复表单
    this.hideReplyForm();

    const parentComment = document.querySelector(`[data-comment-id="${parentId}"]`);
    if (!parentComment) return;

    const replyForm = document.createElement('div');
    replyForm.className = 'comment-reply-form';
    replyForm.innerHTML = `
      <div class="reply-header">
        <span>回复给 <strong>${this.escapeHtml(this.findComment(parentId).author)}</strong></span>
        <button class="cancel-reply-btn">取消</button>
      </div>
      <input type="hidden" id="reply-to-id" value="${parentId}">
      <textarea id="reply-content" placeholder="写下你的回复..." rows="3"></textarea>
      <button class="submit-reply-btn" onclick="commentManager.submitReply()">发送回复 💕</button>
    `;

    parentComment.appendChild(replyForm);

    // 绑定取消按钮事件
    replyForm.querySelector('.cancel-reply-btn').addEventListener('click', () => {
      this.hideReplyForm();
    });

    // 聚焦到回复输入框
    replyForm.querySelector('textarea').focus();
  }

  // 隐藏回复表单
  hideReplyForm() {
    const existingReplyForm = document.querySelector('.comment-reply-form');
    if (existingReplyForm) {
      existingReplyForm.remove();
    }
  }

  // 提交回复
  submitReply() {
    const contentInput = document.getElementById('reply-content');
    const parentInput = document.getElementById('reply-to-id');
    const authorInput = document.getElementById('comment-author');

    if (!authorInput.value.trim()) {
      this.showMessage('请先填写昵称哦～', 'error');
      authorInput.focus();
      return;
    }

    if (!contentInput.value.trim()) {
      this.showMessage('请填写回复内容～', 'error');
      contentInput.focus();
      return;
    }

    const parentId = parentInput.value;
    if (this.addComment(authorInput.value, contentInput.value, parentId)) {
      this.hideReplyForm();
    }
  }

  // 显示消息提示
  showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-toast message-${type}`;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    // 显示动画
    setTimeout(() => {
      messageDiv.classList.add('show');
    }, 100);

    // 3秒后自动消失
    setTimeout(() => {
      messageDiv.classList.remove('show');
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.parentNode.removeChild(messageDiv);
        }
      }, 300);
    }, 3000);
  }
}

// 页面加载完成后初始化留言管理器
document.addEventListener('DOMContentLoaded', () => {
  window.commentManager = new CommentManager();
});