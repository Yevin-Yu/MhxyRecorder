// PWA 注册和管理工具（无自动安装提醒）

class PWAHelper {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.registration = null;
    this.isInstalled = false;
    this.deferredPrompt = null; // 存储安装提示事件
  }

  // 注册 Service Worker
  async registerServiceWorker() {
    if (!this.isSupported) {
      console.log('PWA: Service Worker not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('PWA: Service Worker registered successfully', this.registration);
      
      // 监听 Service Worker 更新
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.showUpdateNotification();
          }
        });
      });

      return true;
    } catch (error) {
      console.error('PWA: Service Worker registration failed', error);
      return false;
    }
  }

  // 显示更新通知
  showUpdateNotification() {
    if (confirm('梦幻西游工具箱有新版本可用，是否立即更新？')) {
      window.location.reload();
    }
  }

  // 检查是否已安装
  async checkInstallation() {
    if (!this.isSupported) return false;

    // 检查是否在独立窗口中运行
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                      window.navigator.standalone === true;
    
    return this.isInstalled;
  }

  // 手动触发安装（不自动弹出）
  async install() {
    if (!this.isSupported) return false;

    try {
      if (this.deferredPrompt) {
        // 显示安装提示
        this.deferredPrompt.prompt();
        
        // 等待用户响应
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log('PWA: Install prompt outcome:', outcome);
        
        // 清除 deferredPrompt
        this.deferredPrompt = null;
        
        return outcome === 'accepted';
      } else {
        console.log('PWA: No install prompt available');
        return false;
      }
    } catch (error) {
      console.error('PWA: Install failed', error);
      return false;
    }
  }

  // 检查是否可以安装
  canInstall() {
    return this.deferredPrompt !== null && !this.isInstalled;
  }

  // 请求通知权限
  async requestNotificationPermission() {
    if (!this.isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      console.log('PWA: Notification permission:', permission);
      return permission === 'granted';
    } catch (error) {
      console.error('PWA: Notification permission request failed', error);
      return false;
    }
  }

  // 发送通知
  async sendNotification(title, options = {}) {
    if (!this.isSupported || Notification.permission !== 'granted') return;

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon.svg',
        badge: '/icons/icon.svg',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('PWA: Send notification failed', error);
    }
  }

  // 检查网络状态
  checkNetworkStatus() {
    return navigator.onLine;
  }

  // 监听网络状态变化
  onNetworkStatusChange(callback) {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  }

  // 获取缓存信息
  async getCacheInfo() {
    if (!this.isSupported) return null;

    try {
      const cacheNames = await caches.keys();
      const cacheInfo = {};

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        cacheInfo[cacheName] = keys.length;
      }

      return cacheInfo;
    } catch (error) {
      console.error('PWA: Get cache info failed', error);
      return null;
    }
  }

  // 清理缓存
  async clearCache() {
    if (!this.isSupported) return;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('PWA: Cache cleared');
    } catch (error) {
      console.error('PWA: Clear cache failed', error);
    }
  }
}

// 创建全局实例
const pwaHelper = new PWAHelper();

// 初始化 PWA（不显示自动安装提醒）
async function initPWA() {
  // 注册 Service Worker
  await pwaHelper.registerServiceWorker();

  // 检查安装状态
  await pwaHelper.checkInstallation();

  // 监听网络状态
  pwaHelper.onNetworkStatusChange((isOnline) => {
    if (!isOnline) {
      pwaHelper.sendNotification('梦幻西游工具箱', {
        body: '当前处于离线模式，部分功能可能受限',
        icon: '/icons/icon.svg'
      });
    }
  });

  // 监听安装事件（但不自动显示）
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    pwaHelper.deferredPrompt = e; // 保存事件，供手动触发使用
    console.log('PWA: Install prompt available (not auto-showing)');
  });

  // 监听应用安装完成
  window.addEventListener('appinstalled', () => {
    console.log('PWA: App installed');
    pwaHelper.isInstalled = true;
    pwaHelper.deferredPrompt = null;
  });
}

// 将 pwaHelper 挂载到全局，供组件使用
window.pwaHelper = pwaHelper;

export { pwaHelper, initPWA };
