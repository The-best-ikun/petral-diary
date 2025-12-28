// Petal Diary - 主题切换功能

class ThemeManager {
  constructor() {
    this.storageKey = 'petal-diary-theme';
    this.darkThemeClass = 'dark-theme';
    this.init();
  }

  init() {
    // 初始化主题
    this.loadTheme();
    
    // 绑定主题切换按钮事件
    this.bindThemeToggle();
    
    // 监听系统主题变化
    this.watchSystemTheme();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem(this.storageKey);
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    // 优先使用保存的主题，其次使用系统偏好
    const theme = savedTheme || systemPreference;
    this.applyTheme(theme);
  }

  applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add(this.darkThemeClass);
    } else {
      root.removeAttribute('data-theme');
      document.body.classList.remove(this.darkThemeClass);
    }
    
    // 保存到本地存储
    localStorage.setItem(this.storageKey, theme);
    
    // 更新切换按钮
    this.updateToggleButton(theme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  bindThemeToggle() {
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  updateToggleButton(theme) {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;
    
    const icon = toggleButton.querySelector('.theme-icon');
    const text = toggleButton.querySelector('.theme-text');
    
    if (theme === 'dark') {
      if (icon) icon.textContent = '🌙'; // 夜晚模式显示月亮
      if (text) text.textContent = '白天';
      toggleButton.title = '切换到白天模式';
    } else {
      if (icon) icon.textContent = '🌙'; // 白天模式显示月亮（方便切换到夜晚）
      if (text) text.textContent = '夜晚';
      toggleButton.title = '切换到夜晚模式';
    }
  }

  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // 只有在没有用户偏好设置时才跟随系统
      const savedTheme = localStorage.getItem(this.storageKey);
      if (!savedTheme) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // 获取当前主题
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  // 设置特定主题
  setTheme(theme) {
    if (theme === 'dark' || theme === 'light') {
      this.applyTheme(theme);
    }
  }
}

// 页面加载完成后初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
  
  // 初始化汉堡菜单
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      // 切换汉堡菜单按钮的active类
      navToggle.classList.toggle('active');
      // 切换导航菜单的active类
      navMenu.classList.toggle('active');
    });
    
    // 点击菜单外部关闭菜单
    document.addEventListener('click', (event) => {
      if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
    
    // 点击菜单项后关闭菜单
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
});

// 为了兼容性，也支持手动调用
window.PetalDiary = window.PetalDiary || {};
window.PetalDiary.ThemeManager = ThemeManager;