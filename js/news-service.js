// 农业新闻服务
class NewsService {
    constructor() {
        // 使用天行数据 API，需要替换为您的 API Key
        this.apiKey = 'e0d7047c0fd694ff7c6bfe0a171beb9a';
        this.baseUrl = 'http://api.tianapi.com/nongye/index';
        this.newsCache = [];
        this.lastUpdateTime = null;
        // 更新默认农业相关图片数组，使用小番茄种植相关图片
        this.defaultImages = [
            'logo/tomato1.jpg',  // 枝头成熟的小番茄特写
            'logo/tomato2.jpg',  // 温室大棚中的番茄
            'logo/tomato3.jpg',  // 盆栽小番茄丰收图
            'logo/tomato4.jpg',  // 室内盆栽小番茄
            'logo/tomato5.jpg',  // 阳台种植的小番茄
            'logo/tomato6.jpg'   // 多盆小番茄种植
        ];
    }

    async fetchNews() {
        try {
            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}&num=6`);
            const data = await response.json();
            
            if (data.code === 200) {
                // 确保至少有6条新闻
                let newslist = data.newslist;
                while (newslist.length < 6) {
                    // 如果新闻数量不足，复制已有的新闻
                    newslist = newslist.concat(newslist.slice(0, 6 - newslist.length));
                }
                
                this.newsCache = newslist.slice(0, 6).map((news, index) => ({
                    title: news.title,
                    description: news.description || '暂无详细描述',
                    url: news.url,
                    image: this.defaultImages[index],
                    pubDate: news.ctime
                }));
                this.lastUpdateTime = new Date();
                return this.newsCache;
            } else {
                console.error('获取新闻失败:', data.msg);
                // 如果API调用失败，返回默认新闻数据
                return this.getDefaultNews();
            }
        } catch (error) {
            console.error('获取新闻出错:', error);
            // 如果发生错误，返回默认新闻数据
            return this.getDefaultNews();
        }
    }

    // 直接使用默认新闻数据
    async getNews() {
        return this.getDefaultNews();
    }

    getDefaultNews() {
        return [
            {
                title: '小番茄种植基础技术指南',
                description: '详细介绍小番茄的种植要求、管理技巧，包括土壤选择、温度控制、水分管理等关键技术要点。',
                url: 'https://baijiahao.baidu.com/s?id=1798049863904444226',
                image: this.defaultImages[0],
                pubDate: new Date().toISOString()
            },
            {
                title: '小番茄种植时间及栽培技术',
                description: '全面解析小番茄的最佳种植时间、种子选购要点，以及详细的栽培管理方法。',
                url: 'https://flowerwish.cn/post/6339.html',
                image: this.defaultImages[4],
                pubDate: new Date().toISOString()
            },
            {
                title: '7步轻松种植小番茄',
                description: '图文详解小番茄种植的7个关键步骤，包括摘芯、摘腋芽、搭支架等实用技巧。',
                url: 'https://baijiahao.baidu.com/s?id=1660454859477091374',
                image: this.defaultImages[5],
                pubDate: new Date().toISOString()
            },
            {
                title: '小番茄高效种植技术',
                description: '专业解读小番茄的高效种植方法，提高产量和品质的实用技术要点。',
                url: 'https://www.cnhnb.com/xt/article-44173.html',
                image: this.defaultImages[1],
                pubDate: new Date().toISOString()
            },
            {
                title: '小西红柿种植管理技术',
                description: '系统介绍小西红柿的种植方法和管理技术，从育苗到采收的全程指导。',
                url: 'https://www.cnhnb.com/xt/article-118540.html',
                image: this.defaultImages[2],
                pubDate: new Date().toISOString()
            },
            {
                title: '番茄盆栽完美种植攻略',
                description: '最详细的番茄盆栽种植指南，让你在家轻松种出完美番茄。',
                url: 'https://www.thepaper.cn/newsDetail_forward_23971208',
                image: this.defaultImages[3],
                pubDate: new Date().toISOString()
            }
        ];
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
}

// 创建新闻服务实例
const newsService = new NewsService();

// 更新新闻展示
async function updateNewsDisplay() {
    const newsSlider = document.querySelector('.news-slider');
    if (!newsSlider) return;

    const news = await newsService.getNews();
    
    // 清空现有内容
    newsSlider.innerHTML = '';

    // 添加新闻卡片
    news.forEach(item => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="news-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="news-footer">
                    <span class="news-date">${newsService.formatDate(item.pubDate)}</span>
                    <a href="${item.url}" class="read-more">
                        查看详情 <span class="material-icons">arrow_forward</span>
                    </a>
                </div>
            </div>
        `;
        newsSlider.appendChild(newsCard);
    });
}

// 页面加载时更新新闻
document.addEventListener('DOMContentLoaded', updateNewsDisplay); 