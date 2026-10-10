document.addEventListener('DOMContentLoaded', function() {

    // --- Configuration ---
    const SITE_START_DATE = '2025-01-12T00:00:00';
    const HITOKOTO_API = 'https://v1.hitokoto.cn';
    const SOCIAL_LINKS_DATA = [
      {
        "name": "Github",
        "icon": "images/icon/github.png",
        "tip": "去 Github 看看",
        "url": "https://github.com/Starsky-Z"
      },
      {
        "name": "BiliBili",
        "icon": "images/icon/bilibili.png",
        "tip": "(゜-゜)つロ 干杯 ~",
        "url": "https://space.bilibili.com/1695612505"
      },
      {
        "name": "QQ",
        "icon": "images/icon/qq.png",
        "tip": "有什么事吗 ~",
        "url": "https://qm.qq.com/q/BgmNB6SzBK"
      },
      {
        "name": "Email",
        "icon": "images/icon/email.png",
        "tip": "来封 Email ~",
        "url": "mailto:2018704358@qq.com"
      },
      {
        "name": "Steam",
        "icon": "images/icon/steam.png",
        "tip": "来一起玩 ~",
        "url": "https://steamcommunity.com/id/StarSkyZ/"
      }
    ];
    const NAV_LINKS_DATA = [
      {
        "name": "博客",
        "link": "https://blog.starskyz.top/"
      },
      {
        "name": "音乐",
        "link": "https://blog.starskyz.top/music"
      },
      {
        "name": "热点",
        "link": "https://blog.starskyz.top/news"
      },
      {
        "name": "API",
        "link": "https://myapi.starskyz.top/"
      }, 
      {   
        "name": "图床",
        "link": "https://imghub.starskyz.top/"
      },
      {
        "name": "拼好图",
        "link": "https://pic23.starskyz.top/"
      },
      {
        "name": "监测站",
        "link": "https://status.starskyz.top/"
      }
    ];

    // --- Element Cache ---
    const elements = {
        desktopRuntime: document.getElementById('desktop-runtime'),
        mobileRuntime: document.getElementById('mobile-runtime'),
        desktopCopyright: document.getElementById('desktop-copyright'),
        mobileCopyright: document.getElementById('mobile-copyright'),
        hitokotoSentence: document.getElementById('hitokoto-sentence'),
        socialTip: document.getElementById('social-tip'),
        timeCapsule: document.getElementById('time-capsule'),
        welcomeToast: document.getElementById('welcome-toast'),
        socialLinksContainer: document.querySelector('.social-links'),
        navContainer: document.querySelector('.card-nav'),
        digitalClock: document.getElementById('digital-clock'),
    };

    // 1. Dynamic Content Building
    function buildSocials() {
        let html = '';
        SOCIAL_LINKS_DATA.forEach(social => {
            html += `<a href="${social.url}" target="_blank" data-tip="${social.tip}" data-name="${social.name}"><img src="${social.icon}" alt="${social.name}"></a>`;
        });
        elements.socialLinksContainer.innerHTML = html;
        addSocialLinkListeners();
    }

    function buildNav() {
        let html = '';
        NAV_LINKS_DATA.forEach(nav => {
            html += `<a href="${nav.link}" target="_blank" class="card">${nav.name}</a>`;
        });
        elements.navContainer.innerHTML = html;
    }

    // 2. Clock
    function updateClock() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()];
        
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        if (!elements.digitalClock.querySelector('#clock-time')) {
            elements.digitalClock.innerHTML = '<div id="clock-time"></div><div id="clock-date"></div>';
        }
        
        document.getElementById('clock-time').textContent = `${hours}:${minutes}:${seconds}`;
        document.getElementById('clock-date').textContent = `${year}-${month}-${day} ${week}`;
    }

    // 3. Site Runtime & Copyright
    function updateRuntime() {
        const diff = new Date() - new Date(SITE_START_DATE);
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        const runtimeString = `本站已运行: ${d} 天 ${h} 小时 ${m} 分钟 ${s} 秒`;
        if (elements.desktopRuntime) elements.desktopRuntime.textContent = runtimeString;
        if (elements.mobileRuntime) elements.mobileRuntime.textContent = runtimeString;
    }

    function updateCopyright() {
        const startYear = new Date(SITE_START_DATE).getFullYear();
        const currentYear = new Date().getFullYear();
        const copyrightString = `&copy; ${startYear} - ${currentYear} StarSkyZ. All Rights Reserved.`;
        if (elements.desktopCopyright) elements.desktopCopyright.innerHTML = copyrightString;
        if (elements.mobileCopyright) elements.mobileCopyright.innerHTML = copyrightString;
    }

    // 4. Hitokoto & Social Interaction
    async function fetchHitokoto() {
        try {
            const response = await fetch(HITOKOTO_API);
            const data = await response.json();
            elements.hitokotoSentence.textContent = data.hitokoto;
        } catch (error) {
            elements.hitokotoSentence.textContent = '每一个不曾起舞的日子，都是对生命的辜负。';
            console.error('Failed to fetch Hitokoto:', error);
        }
    }
    
    function addSocialLinkListeners() {
        document.querySelectorAll('.social-links a').forEach(link => {
            link.addEventListener('mouseenter', () => {
                elements.hitokotoSentence.style.opacity = '0';
                elements.socialTip.textContent = link.dataset.tip;
                elements.socialTip.style.opacity = '1';
            });
            link.addEventListener('mouseleave', () => {
                elements.hitokotoSentence.style.opacity = '1';
                elements.socialTip.style.opacity = '0';
            });
        });
    }

    // 5. Time Capsule
    function updateTimeCapsule() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear() + 1, 0, 1);
        const percentage = ((now - start) / (end - start)) * 100;
        
        if (!elements.timeCapsule.querySelector('#time-capsule-title')) {
             elements.timeCapsule.innerHTML = '<div id="time-capsule-title"></div><div id="progress-bar-container"><div id="progress-bar"></div></div>'
        }
        
        document.getElementById('time-capsule-title').textContent = `今年已度过 ${percentage.toFixed(6)}%`;
        document.getElementById('progress-bar').style.width = percentage + '%';
    }

    // 6. Welcome Toast
    function showWelcomeToast() {
        const hour = new Date().getHours();
        const greetings = {
            deep_night: [
                '夜深了，还在为梦想拼搏吗？', '星星都睡了，你还不睡吗？', '夜阑人静，注意休息哦。', 
                '一份安静的问候，给深夜的你。', '又是一个不眠夜，别太劳累。', '嘘，听，是梦想开花的声音。',
                '已是半夜，看到你真是个意外的惊喜。', '早点休息，明天又是新的一天。', 
                '深夜的访客，愿你被世界温柔以待。', '你的努力，星星都看在眼里。'
            ],
            early_morning: [
                '早上好！新的一天开始了。', '一日之计在于晨，今天也要加油哦！', '早起的鸟儿有虫吃，早起的你最棒！',
                '清晨的阳光，为你而来。', '今天也是元气满满的一天！', '早安，世界。早安，特别的你。',
                '一份清新的问候，祝你今天心情愉快。', '起来迎接今天份的挑战吧！', '闻到清晨的芬芳了吗？',
                '这么早就开始努力，你一定会成功的！'
            ],
            morning: [
                '上午好！今天的工作/学习顺利吗？', '打起精神，喝杯咖啡吧！', '愿你有个高效又愉快的上午。',
                '时间过得真快，上午也要加油！', '保持专注，你正在变得更好。', '今天的你，比昨天更博学了吗？',
                '一份温暖的问候，给正在奋斗的你。', '别忘了偶尔站起来活动一下哦。', '保持微笑，今天也会是美好的一天！',
                '阳光正好，微风不燥，一切都刚刚好。'
            ],
            afternoon: [
                '中午好！午饭吃了吗？', '下午好，适当午休，精力更充沛。', '午后的阳光，愿你心情舒畅。',
                '犯困了吗？来杯茶提提神吧。', '愿你有个轻松惬意的下午时光。', '下午的努力，是为了晚上的心安理得。',
                '坚持一下，很快就到休息时间了。', '午后小憩，为了更好地前行。', '吃饱喝足，下午也要继续加油！',
                '愿你扫除所有疲惫和焦虑。'
            ],
            evening: [
                '傍晚好，辛苦一天了。', '夕阳无限好，愿你心情也好。', '今天过得怎么样？准备好放松一下了吗？',
                '晚霞与你，皆是温柔。', '结束了一天的忙碌，是时候犒劳一下自己了。', '傍晚的风，带着回家的讯号。',
                '今天也是努力生活的一天呢。', '天快黑了，记得早点回家。', '不早不晚，你来的正是时候。',
                '祝你有一个美好的傍晚。'
            ],
            night: [
                '晚上好，享受属于自己的宁静时光吧。', '无论多晚，都有星星和月亮陪着你。', '今天辛苦了，早点休息。',
                '卸下一天的疲惫，晚安。', '月亮睡了你不睡，你是人间小美味。', '晚上好，是时候放下工作，享受生活了。',
                '愿你今夜好梦，忘却所有烦恼。', '给疲惫的你，一个温柔的拥抱。', '世界晚安，但对你说早安。',
                '忙碌的一天结束了，愿你被黑夜温柔以待。'
            ]
        };
        
        let timeSlot;
        if (hour >= 0 && hour < 4) timeSlot = 'deep_night';
        else if (hour >= 4 && hour < 8) timeSlot = 'early_morning';
        else if (hour >= 8 && hour < 12) timeSlot = 'morning';
        else if (hour >= 12 && hour < 16) timeSlot = 'afternoon';
        else if (hour >= 16 && hour < 20) timeSlot = 'evening';
        else timeSlot = 'night';
        
        const greet = greetings[timeSlot][Math.floor(Math.random() * greetings[timeSlot].length)];
        
        elements.welcomeToast.textContent = greet;
        elements.welcomeToast.style.top = '20px';
        setTimeout(() => {
            elements.welcomeToast.style.top = '-100px';
        }, 4000);
    }
    
    // 7. Mourning Mode
    function setMourningMode(enable = false) {
        document.documentElement.classList.toggle('mourning', enable);
    }

    // 8. Mobile Screen Switch
    function initMobileSwitch() {
        const switchButton = document.getElementById('mobile-switch');
        if (switchButton) {
            switchButton.addEventListener('click', function() {
                document.body.classList.toggle('show-screen-2');
                this.classList.toggle('active');
            });
        }
    }

    // 9. Disable Right Click
    function disableRightClick() {
        window.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    }

    // --- Initialization ---
    buildNav();
    buildSocials();
    fetchHitokoto();
    updateClock();
    updateCopyright();
    updateRuntime();
    updateTimeCapsule();
    showWelcomeToast();
    initMobileSwitch();
    disableRightClick();
    
    setInterval(updateClock, 1000);
    setInterval(updateRuntime, 1000);
    setInterval(updateTimeCapsule, 50);

});