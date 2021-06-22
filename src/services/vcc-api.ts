import axios from 'axios';

export const vccApi = axios.create({
  baseURL: 'https://www.vccgenerator.com/fetchdata/get-binsearch-params/',
  headers: {
    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    'x-csrftoken': 'E7yXZxvg5vNQ4OYXSbPkOUiwMIhLhbtMrPFbiL7USG90PffN6EJg60KRN4VKK8FK',
    cookie:
      'csrftoken=ImIg58qKnUPnKfNvcW3UmXgJ1UkTSXYHv4Puom2oa5bxvG4lqpXQE3I42gYSlUaF; _ga=GA1.2.1700469848.1624326802; _gid=GA1.2.1002621659.1624326802',
  },
});
