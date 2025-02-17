// 聊天记录数组
let chatHistory = [];

// 发送消息函数
function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (message) {
        // 添加用户消息
        addMessage('user', message);
        
        // 模拟AI响应
        setTimeout(() => {
            const aiResponse = "这是一个示例回复。在实际应用中，你需要连接到真实的AI服务。";
            addMessage('ai', aiResponse);
        }, 1000);
        
        // 清空输入框
        input.value = '';
    }
}

// 添加消息到聊天界面
function addMessage(type, content) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    
    // 保存到聊天记录
    chatHistory.push({
        type: type,
        content: content,
        timestamp: new Date().toISOString()
    });
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 监听回车键
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}); 