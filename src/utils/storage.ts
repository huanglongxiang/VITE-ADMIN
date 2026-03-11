/**
 * 通用 Storage 工具类
 * 支持 localStorage/sessionStorage、过期时间、命名空间、类型安全、加密（可选）
 * 解决原生 Storage 仅支持字符串、无过期、易冲突问题
 */
type StorageType = 'localStorage' | 'sessionStorage';
type StorageData = string | number | boolean | object | null;
import CryptoJS from 'crypto-js';

interface StorageOptions {
  // 过期时间（单位：秒），默认永久
  expire?: number;
  // 命名空间（避免同域名下不同项目数据冲突）
  namespace?: string;
  // 是否加密存储（可选，需自行实现加密逻辑）
  encrypt?: boolean;
}

// 默认配置
const DEFAULT_OPTIONS: Required<Omit<StorageOptions, 'expire'>> = {
  namespace: 'vite_admin_', // 自定义你的命名空间
  encrypt: false,
};

// 加密/解密工具（示例：简单base64，生产建议用更安全的加密方式如AES）
const cryptoUtil = {
  encrypt: (data: string): string => {
    return CryptoJS.AES.encrypt(data, import.meta.env.ENCRYPTION_KEY).toString();
  },
  decrypt: (data: string): string => {
    const bytes = CryptoJS.AES.decrypt(data, import.meta.env.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  },
};

class StorageUtil {
  private storage: Storage;
  private options: Required<Omit<StorageOptions, 'expire'>>;

  /**
   * 构造函数
   * @param type 存储类型：localStorage/sessionStorage
   * @param customOptions 自定义配置
   */
  constructor(type: StorageType = 'localStorage', customOptions: Partial<StorageOptions> = {}) {
    this.storage = window[type];
    this.options = { ...DEFAULT_OPTIONS, ...customOptions };
  }

  /**
   * 生成带命名空间的key
   * @param key 原始key
   * @returns 带命名空间的key
   */
  private getFullKey(key: string): string {
    return `${this.options.namespace}${key}`;
  }

  /**
   * 存储数据（支持过期时间、自动序列化）
   * @param key 存储键名
   * @param data 存储数据（支持任意可序列化类型）
   * @param options 可选配置（过期时间、是否加密）
   */
  set(key: string, data: StorageData, options: StorageOptions = {}): void {
    try {
      const fullKey = this.getFullKey(key);
      const finalOptions = { ...this.options, ...options };

      // 构造存储对象（包含数据和过期时间）
      const storageValue = {
        data,
        expire: finalOptions.expire ? Date.now() + finalOptions.expire * 1000 : null, // 过期时间戳（毫秒）
      };

      // 序列化 + 可选加密
      let strValue = JSON.stringify(storageValue);
      if (finalOptions.encrypt) {
        strValue = cryptoUtil.encrypt(strValue);
      }

      // 存入storage
      this.storage.setItem(fullKey, strValue);
    } catch (error) {
      console.error(`Storage 设置失败 [key: ${key}]`, error);
    }
  }

  /**
   * 获取数据（自动反序列化、自动校验过期）
   * @param key 存储键名
   * @param defaultValue 默认值（数据不存在/过期时返回）
   * @returns 解析后的数据（类型与 defaultValue 一致）
   */
  get<T = StorageData>(key: string, defaultValue: T = null as T): T {
    try {
      const fullKey = this.getFullKey(key);
      const strValue = this.storage.getItem(fullKey);

      // 数据不存在
      if (!strValue) return defaultValue;

      // 解密 + 反序列化
      let parsedValue: { data: StorageData; expire: number | null };
      try {
        const decryptedValue = this.options.encrypt ? cryptoUtil.decrypt(strValue) : strValue;
        parsedValue = JSON.parse(decryptedValue);
      } catch (error) {
        console.error(`Storage 解析失败 [key: ${key}]`, error);
        this.remove(key); // 解析失败，清理脏数据
        return defaultValue;
      }

      // 校验过期时间
      if (parsedValue.expire && Date.now() > parsedValue.expire) {
        this.remove(key); // 已过期，清理数据
        return defaultValue;
      }

      // 返回数据（类型断言）
      return (parsedValue.data as T) ?? defaultValue;
    } catch (error) {
      console.error(`Storage 获取失败 [key: ${key}]`, error);
      return defaultValue;
    }
  }

  /**
   * 删除指定key的数据
   * @param key 存储键名
   */
  remove(key: string): void {
    try {
      const fullKey = this.getFullKey(key);
      this.storage.removeItem(fullKey);
    } catch (error) {
      console.error(`Storage 删除失败 [key: ${key}]`, error);
    }
  }

  /**
   * 清空当前命名空间下的所有数据（不会清空其他命名空间）
   */
  clearNamespace(): void {
    try {
      const namespace = this.options.namespace;
      // 遍历所有key，只删除当前命名空间的
      Object.keys(this.storage).forEach((key) => {
        if (key.startsWith(namespace)) {
          this.storage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Storage 清空命名空间失败', error);
    }
  }

  /**
   * 清空所有storage数据（谨慎使用！会删除所有数据，包括其他命名空间）
   */
  clearAll(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Storage 清空全部失败', error);
    }
  }

  /**
   * 检查key是否存在（忽略过期）
   * @param key 存储键名
   * @returns 是否存在
   */
  has(key: string): boolean {
    try {
      const fullKey = this.getFullKey(key);
      return !!this.storage.getItem(fullKey);
    } catch (error) {
      console.error(`Storage 检查key失败 [key: ${key}]`, error);
      return false;
    }
  }
}

// 导出常用实例（开箱即用）
const localStg = new StorageUtil('localStorage'); // localStorage 实例
const sessionStg = new StorageUtil('sessionStorage'); // sessionStorage 实例

export default {
  localStg,
  sessionStg,
};