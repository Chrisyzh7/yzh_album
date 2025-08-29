document.addEventListener('DOMContentLoaded', () => {
    const initialModal = document.getElementById('initialModal');
    const enterButton = document.getElementById('enterButton');
    const mainContent = document.getElementById('mainContent');

    const willingBtn = document.getElementById('willingBtn');
    const unwillingBtn = document.getElementById('unwillingBtn');
    const questionText = document.getElementById('questionText');

    // 获取所有导航链接
    const navLinks = document.querySelectorAll('.album-navigation a');

    // 初始弹出框的文本（未直接使用）
    const happyBirthdayText = document.querySelector('.happy-birthday-text');

    // --- 音乐播放列表功能 ---
    const musicPlaylist = [
        'music/余佳运 - 和你.ogg', // <-- 你的第一首歌，OGG格式
        'music/song2.mgg'  // <-- 你的第二首歌，MGG格式 (强烈建议转换为MP3或OGG，MGG通常不被浏览器支持)
        // 可以继续添加更多歌曲，确保路径和文件名正确
    ];
    let currentSongIndex = 0;
    let backgroundMusic = null; // 初始化为 null，将在需要时创建

    // 加载并播放当前歌曲的函数
    function loadAndPlayCurrentSong() {
        // 如果有正在播放的音乐，先暂停并移除事件监听器
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            backgroundMusic.removeEventListener('ended', playNextSong);
        }

        const currentSource = musicPlaylist[currentSongIndex];
        const fileExtension = currentSource.split('.').pop().toLowerCase(); // 获取文件扩展名
        const mimeType = `audio/${fileExtension}`; // 构造MIME类型，例如 "audio/ogg"

        const tempAudio = new Audio(); // 创建一个临时的Audio对象来检查兼容性

        // 检查浏览器是否能播放当前文件类型
        if (tempAudio.canPlayType(mimeType)) {
            backgroundMusic = new Audio(currentSource);
            backgroundMusic.volume = 0.7; // 可以调整音量
            backgroundMusic.addEventListener('ended', playNextSong); // 监听歌曲播放结束事件

            // 尝试播放
            backgroundMusic.play().catch(error => {
                console.warn(`播放歌曲 "${currentSource}" 失败 (可能被浏览器阻止自动播放):`, error);
                // 播放失败，但不会阻止后续代码执行
            });
        } else {
            console.error(`浏览器无法播放歌曲类型: ${mimeType} (文件: "${currentSource}")。请考虑将此文件转换为 .mp3 格式。`);
            // 如果当前歌曲类型不支持，尝试播放下一首（防止卡死）
            if (musicPlaylist.length > 1) { // 确保有其他歌曲可以尝试
                playNextSong();
            } else {
                console.error("播放列表只有一首歌且不支持，无法继续播放。");
            }
        }
    }

    // 播放下一首歌曲的函数
    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % musicPlaylist.length; // 切换到下一首，如果到末尾则循环
        loadAndPlayCurrentSong(); // 加载并播放下一首
    }

    // --- 雪花效果 ---
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.left = `${Math.random() * 100}vw`;
        // ***关键修改：延长 animationDuration，使雪花飘落更慢***
        snowflake.style.animationDuration = `${Math.random() * 7 + 8}s`; // 8-15秒 (之前是 2-5秒)
        snowflake.style.animationDelay = `${Math.random() * 2}s`;
        snowflake.style.width = `${Math.random() * 5 + 5}px`;
        snowflake.style.height = snowflake.style.width;
        document.body.appendChild(snowflake);

        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
        });
    }

    let snowflakeInterval;
    function startSnowflakes() {
        snowflakeInterval = setInterval(createSnowflake, 200);
    }

    // --- 爱心飘落效果 ---
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💞'];
    function createHeart() {
        const heart = document.createElement('span');
        heart.classList.add('heart-fall');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${Math.random() * 8 + 7}s`; // 7-15秒
        heart.style.animationDelay = `${Math.random() * 3}s`;
        document.body.appendChild(heart);

        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }

    let heartInterval;
    function startHearts() {
        for (let i = 0; i < 5; i++) {
            createHeart();
        }
        heartInterval = setInterval(createHeart, 500);
    }


    // --- 页面初始化逻辑 ---

    // 页面加载后立即启动雪花和爱心效果，它们将贯穿整个页面生命周期
    startSnowflakes();
    startHearts();

    // 显示初始弹出框
    initialModal.style.display = 'flex';

    enterButton.addEventListener('click', () => {
        // 先执行DOM操作，确保页面跳转
        initialModal.style.display = 'none'; // 隐藏模态框
        mainContent.classList.remove('hidden'); // 显示主要内容

        // 然后再尝试播放音乐
        loadAndPlayCurrentSong(); // 在点击进入后开始播放第一首背景音乐
    });

    // 平滑滚动逻辑
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // 最终互动区的文字数组
    const questions = [
        "亲爱的，你愿意一直陪在我身边吗？",
        "再想想，这可是个好机会哦！你忍心拒绝一个为你费尽心思的程序员吗？",
        "别犹豫啦，我的心意你还不懂吗？点击“愿意”，你将获得一个超甜的男朋友！",
        "点击“不愿意”会带来未知的后果哦...你确定要试试吗？",
        "答应我吧，我的未来里，每一步都有你！",
        "你的笑容是我最大的动力，所以请点击“愿意”吧！😊",
        "我把所有的浪漫和爱都放在这里了，你愿意接收吗？",
        "最后一次机会，你真的不考虑一下吗？（语气颤抖）",
        "点一下“愿意”我就能高兴一整年！好不好嘛？",
        "如果点击“不愿意”，这个页面会爆炸哦！😜", // 增加趣味性
        "你是我生命中的唯一，请给我一个肯定的答案吧！",
        "我可是鼓足了勇气才问的，不要让我太难过呀~",
        "答应我，好吗？我有很多很多爱要给你！"
    ];
    let currentQuestionIndex = 0;

    // “不愿意”按钮的文本变化数组
    const unwillingTexts = [
        "再考虑一下",
        "我不信你忍心",
        "别闹了嘛",
        "真的忍心吗？",
        "再点一下试试看",
        "我有点伤心了哦",
        "你确定吗？",
        "你真的要点吗？",
        "呜呜呜...",
        "好啦，别逗我了",
        "再给我一次机会",
        "不...愿...意...",
        "想清楚哦！"
    ];
    let unwillingTextIndex = 0;

    willingBtn.style.transform = 'scale(1)'; // 初始设置愿意按钮大小
    unwillingBtn.style.transform = 'scale(1)'; // 初始设置不愿意按钮大小

    willingBtn.addEventListener('click', () => {
        // 停止播放背景音乐
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            backgroundMusic.removeEventListener('ended', playNextSong); // 移除监听器，避免在最终页面继续循环
        }

        // 播放一个成功音效（可选）
        const successSound = new Audio('audio/success_chime.mp3'); // 替换成你的成功音效
        successSound.play().catch(e => console.log("成功音效播放失败", e));
        
        // 直接更新 mainContent 为最终界面
        mainContent.innerHTML = `
            <div class="final-message">
                <h1>嘻嘻😁</h1> <!-- 移除了名字输入，改为通用称呼 -->
                <p>谢谢你选择了我，未来有你，真好！</p>
                
                <img src="images/39.jpg" alt="我们最棒的照片" style="max-width: 80%; border-radius: 15px; margin-top: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                <p style="margin-top: 20px; font-size: 1.2em;"></p>
                <p style="margin-top: 20px; font-size: 1.2em;">不止七夕 希望我们能在一起 朝朝夕夕~</p>
            </div>
        `;
        mainContent.style.display = 'block';
        mainContent.style.textAlign = 'center';
        mainContent.style.padding = '100px 20px';
        mainContent.style.background = 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)';
        mainContent.style.boxShadow = 'none';
        
        // 可选：如果希望最终页面没有雪花/爱心，可以在这里调用 clearInterval(snowflakeInterval); clearInterval(heartInterval);
    });

    unwillingBtn.addEventListener('click', () => {
        // 1. “不愿意”按钮变小，文字改变
        unwillingTextIndex = (unwillingTextIndex + 1) % unwillingTexts.length;
        unwillingBtn.textContent = unwillingTexts[unwillingTextIndex];
        unwillingBtn.style.transform = `scale(${Math.max(0.6, 1 - unwillingTextIndex * 0.05)})`;
        unwillingBtn.style.backgroundColor = `hsl(${200 - unwillingTextIndex * 5}, 70%, 70%)`;

        // 2. “愿意”按钮变大
        let currentScale = parseFloat(willingBtn.style.transform.replace('scale(', '').replace(')', '')) || 1;
        willingBtn.style.transform = `scale(${currentScale + 0.1})`;
        willingBtn.style.backgroundColor = `hsl(${330 + unwillingTextIndex * 5}, 80%, 65%)`;

        // 3. 变异文本框的文字改变
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        questionText.textContent = questions[currentQuestionIndex];
        questionText.style.color = `hsl(${180 + unwillingTextIndex * 15}, 70%, 50%)`;

        // 可选：加一个“不愿意”音效或震动
        const naughtySound = new Audio('audio/naughty_sound.mp3');
        naughtySound.play().catch(e => console.log("淘气音效播放失败", e));

        // 页面震动效果 (CSS动画)
        document.body.classList.add('shake');
        setTimeout(() => {
            document.body.classList.remove('shake');
        }, 500);
    });

    // 为body添加震动动画的CSS（添加到style.css也可以，或者直接添加到这里）
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            perspective: 1000px;
        }

        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
    `;
    document.head.appendChild(styleSheet);
});