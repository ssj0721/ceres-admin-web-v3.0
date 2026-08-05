import { ref, onMounted, onUnmounted, h } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/utils/request'

export function useSSE(userId) {
  const baseURL = import.meta.env.VITE_ENV === 'development' ? '/api' : import.meta.env.VITE_BASE_URL
  const eventSource = ref(null);
  let retryCount = 0;
  let params = {userId}
  const connect = () => {
    const es = new EventSource(`${baseURL}/sse/connect?userId=${userId}`);
    // const es = request({
    //     url: '/sse/connect',
    //     method: 'get',
    //     params,
    //   })
    es.onopen = () => {
      console.log('SSE连接成功');
      retryCount = 0;
    };
    
    es.onmessage = (e) => {
      ElMessage.success(`收到消息: ${e.data}`);
    };
    
    es.onerror = (e) => {
      if (es.readyState === EventSource.CLOSED) {
        setTimeout(() => {
          retryCount++;
          connect(); // 指数退避重连
        }, Math.min(1000 * Math.pow(2, retryCount), 30000));
      }
    };
    
    eventSource.value = es;
  };

  onMounted(connect);
  onUnmounted(() => eventSource.value?.close());

  return { eventSource };
}

export const connectSSE = (userId) => {
    if(userId!=undefined) {
        const baseURL = import.meta.env.VITE_ENV === 'development' ? '/api' : import.meta.env.VITE_BASE_PREFIX + 'sseserver'
        const eventSource = ref(null);
        const isConnected = ref()
        let retryCount
        let params = {userId}
        // 创建新连接  
        try {  
        //   eventSource.value = request({
        //     url: '/sse/connect',
        //     method: 'get',
        //     params,
        //   })
        eventSource.value = new EventSource(`${baseURL}/sse/connect?userId=${userId}`);
        } catch (e) {  
          console.error('创建连接失败:', e);  
          return;  
        }  
        eventSource.value.onopen = () => {  
          isConnected.value = true;  
          retryCount = 0;  
          console.log('SSE连接成功');  
        };  
          
        eventSource.value.onmessage = (e) => {  
          console.log('收到消息:', e.data);  
        //   ElMessage.success(e.data)
        // 处理消息 
          ElNotification({
            title: '提示',
            message:  h('span', { style: 'color: green' }, e.data),
            duration: 0,
            offset: 50,
          }) 
          // 关闭现有连接（如果存在）  
        //   if (eventSource.value) {  
        //     console.log('调用完关闭连接');
        //     eventSource.value.close(); // 确保close方法存在  
        //   }  
        }; 
        
          
        eventSource.value.onerror = (e) => {  
          isConnected.value = false;  
          console.error('连接错误', e);  
            
          // 指数退避重连  
          if (e.target.readyState === EventSource.CLOSED) {  
            const retryDelay = Math.min(1000 * Math.pow(2, retryCount++), 30000);  
            setTimeout(connectSSE, retryDelay);  
          }  
        }; 
    } 
  };  