import http from "@/api/index";

/* 获取商品列表 */
export const getGoodsList = async (params: any) => {
  return await http.get("/mapz/servergoods/listAllPage", params);
};
