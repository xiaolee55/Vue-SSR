import axios from 'axios';

export function fetchItem(id) {
  console.log("is",id);
  
  return axios.get('https://api.mimei.net.cn/api/v1/article/' + id);
}
export function fetchList() {
  return axios.get('https://api.mimei.net.cn/api/v1/article/');
}
