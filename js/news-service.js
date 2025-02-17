// 农业新闻服务
class NewsService {
    constructor() {
        // 使用天行数据 API，需要替换为您的 API Key
        this.apiKey = 'e0d7047c0fd694ff7c6bfe0a171beb9a';
        this.baseUrl = 'http://api.tianapi.com/nongye/index';
        this.newsCache = [];
        this.lastUpdateTime = null;
        // 更新默认农业相关图片数组，添加吊兰花和甘蔗种植图片
        this.defaultImages = [
            'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            'https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            'https://images.unsplash.com/photo-1599685315640-9ceab2f58944?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            'logo/吊兰花.jpg',  // 添加吊兰花图片
            'logo/甘蔗种植.jpg'  // 添加甘蔗种植图片
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

    // 添加默认新闻数据方法
    getDefaultNews() {
        const defaultNews = [
            {
                title: '吊兰：姿态优美的"空气卫士"',
                description: '吊兰不仅美观，还能净化空气，是理想的室内植物。其白色小花姿态优美，绿叶垂挂，是净化空气的天然卫士。',
                url: '#',
                image: this.defaultImages[4],  // 使用吊兰花图片
                pubDate: new Date().toISOString()
            },
            {
                title: '因何得名？揭秘唐宣满的"姓氏来源"',
                description: '探索古老农业家族的历史渊源和发展历程。',
                image: this.defaultImages[1],
                url: '#',
                pubDate: new Date().toISOString()
            },
            {
                title: '【思政开放麦·时事热点微评】驻村第一书记的强农报国新春"答卷"',
                description: '基层干部在农村振兴中的重要作用和突出贡献。通过实地走访、技术指导等方式，助力农民增收致富。',
                image: this.defaultImages[5],  // 使用甘蔗种植图片
                url: '#',
                pubDate: new Date().toISOString()
            },
            {
                title: '智慧农业发展新趋势',
                description: '探讨现代农业科技创新和数字化转型的最新进展。',
                image: this.defaultImages[3],
                url: '#',
                pubDate: new Date().toISOString()
            },
            {
                title: '有机种植技术创新',
                description: '最新的有机农业种植方法和可持续发展实践。',
                image: this.defaultImages[2],
                url: '#',
                pubDate: new Date().toISOString()
            },
            {
                title: '农业政策解读与展望',
                description: '深入分析最新农业政策对行业发展的影响。',
                image: this.defaultImages[0],
                url: '#',
                pubDate: new Date().toISOString()
            }
        ];
        return defaultNews;
    }

    async getNews() {
        const now = new Date();
        // 如果缓存为空或者最后更新时间超过1小时，重新获取数据
        if (!this.newsCache.length || !this.lastUpdateTime || 
            (now - this.lastUpdateTime) > 3600000) {
            return await this.fetchNews();
        }
        return this.newsCache;
    }

    // 格式化日期
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
    if (!news) return;

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
                    <a href="${item.url}" target="_blank" class="read-more">
                        查看详情 <span class="material-icons">arrow_forward</span>
                    </a>
                </div>
            </div>
        `;
        newsSlider.appendChild(newsCard);
    });
}

// 定时更新新闻（每小时更新一次）
setInterval(updateNewsDisplay, 3600000);

// 页面加载时立即更新一次
document.addEventListener('DOMContentLoaded', updateNewsDisplay); 