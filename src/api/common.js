import $http from '@/utils/http';

/**
 *  通用接口
 */
export default class CommonService {
  static list(params) {
    return $http.get('', params);
  }
};

// export default CommonService {
//   list(params) {
//     return $http.get('', params);
//   }
// };
