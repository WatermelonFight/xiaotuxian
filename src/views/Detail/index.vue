<script setup>
import { getDetailsAPI } from "@/apis/detail";
import { onMounted,ref } from 'vue'
import { useRoute } from 'vue-router'
import DetailsHot from "./components/DetailsHot.vue";
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { useCartStore } from "@/stores/cartStore";

const detailsData = ref({})
const route = useRoute()
const getDetails = async () => {
    const res = await getDetailsAPI(route.params.id)
    detailsData.value = res.result
    console.log(111,res);
}
onMounted(()=>{ getDetails() })

let skuObj = {}
const skuChange = (sku) => {
    // console.log(123,sku);
    skuObj = sku
}

//购物车

const count = ref(1)
//此处count应该是组件设定传来的
const countChange = (count) => {
  console.log(count);

}
//添加到购物车
const cartStore = useCartStore()
const addCart = () => {
  //对象为空时也是被判断为真，所以不能直接用对象判断
  if(skuObj.skuId){
    cartStore.addCart({
      id:detailsData.value.id,
      name:detailsData.value.name,
      picture:detailsData.value.mainPictures[0],
      price:detailsData.value.price,
      count:count.value,
      skuId:skuObj.skuId,
      ottrsText:skuObj.specsText,
      selected:true
    })
  }
  else{
    ElMessage.warning('请选择规格')
  }
}
</script>
<!-- 
在Vue中，当一个响应式数据（比如通过ref创建的数据）的值发生变化时，Vue会自动触发相应的模板重新渲染，以确保视图与数据保持同步。这是Vue响应式系统的特性之一。
然而，当涉及到异步加载数据时，可能会出现数据加载尚未完成而导致某些属性为undefined的情况。这种情况下，即使goodsProduct是响应式数据，但在模板中访问其属性时，如果属性的值尚未被正确赋值，就会得到undefined.
这可能会导致页面显示不完整或出现意外的结果。
 -->
<template>
  <div class="xtx-goods-page">
    <!-- 当接收到details的数据时才执行 -->
    <div class="container" v-if="detailsData.details">
      <div class="bread-container">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <!-- 坑！！！ -->
          <!-- 错误原因：goods一开始{} {}.categories ->undefined -> undefined[1]
          解决方法：1.可选链的语法?.  前面有值才继续运算
                    2.v-if手动控制渲染时机 保证只有数据存在才渲染 -->
          <el-breadcrumb-item :to="{ path: `/category/${detailsData.categories?.[1].id}` }">{{ detailsData.categories?.[1].name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: `/category/sub/${detailsData.categories?.[0].id}` }">{{ detailsData.categories?.[0].name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ detailsData.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 商品信息 -->
      <div class="info-container">
        <div>
          <div class="goods-info">
            <div class="media">
              <!-- 图片预览区 -->
                <XtxImageView :imageList="detailsData.mainPictures"></XtxImageView>
              <!-- 统计数量 -->
              <ul class="goods-sales">
                <li>
                  <p>销量人气</p>
                  <p> {{ detailsData.salesCount }}+ </p>
                  <p><i class="iconfont icon-task-filling"></i>销量人气</p>
                </li>
                <li>
                  <p>商品评价</p>
                  <p>{{ detailsData.commentCount }}+</p>
                  <p><i class="iconfont icon-comment-filling"></i>查看评价</p>
                </li>
                <li>
                  <p>收藏人气</p>
                  <p>{{ detailsData.collectCount }}+</p>
                  <p><i class="iconfont icon-favorite-filling"></i>收藏商品</p>
                </li>
                <li>
                  <p>品牌信息</p>
                  <p>{{ detailsData.brand.name }}</p>
                  <p><i class="iconfont icon-dynamic-filling"></i>品牌主页</p>
                </li>
              </ul>
            </div>
            <div class="spec">
              <!-- 商品信息区 -->
              <p class="g-name"> {{ detailsData.name }} </p>
              <p class="g-desc">{{ detailsData.desc }} </p>
              <p class="g-price">
                <span>{{ detailsData.oldPrice }}</span>
                <span> {{ detailsData.price }}</span>
              </p>
              <div class="g-service">
                <dl>
                  <dt>促销</dt>
                  <dd>12月好物放送，App领券购买直降120元</dd>
                </dl>
                <dl>
                  <dt>服务</dt>
                  <dd>
                    <span>无忧退货</span>
                    <span>快速退款</span>
                    <span>免费包邮</span>
                    <a href="javascript:;">了解详情</a>
                  </dd>
                </dl>
              </div>
              <!-- sku组件 -->
              <XtxSku :goods="detailsData" @change = "skuChange" />
              <!-- 数据组件 -->
              <el-input-number v-model="count" @change="countChange" />
              <!-- 按钮组件 -->
              <div>
                <el-button size="large" class="btn" @click="addCart">
                  加入购物车
                </el-button>
              </div>

            </div>
          </div>
          <div class="goods-footer">
            <div class="goods-article">
              <!-- 商品详情 -->
              <div class="goods-tabs">
                <nav>
                  <a>商品详情</a>
                </nav>
                <div class="goods-detail">
                  <!-- 属性 -->
                  <ul class="attrs">
                    <li v-for="item in detailsData.details.properties" :key="item.value">
                      <span class="dt">{{ item.name }}</span>
                      <span class="dd">{{ item.value }}</span>
                    </li>
                  </ul>
                  <!-- 图片 -->
                  <!-- 对象的键（key）可以是字符串或符号（Symbol）类型 -->
                  <img v-for="item in detailsData.details.pictures" v-img-lazy="item"  :src="item" alt="">
                </div>
              </div>
            </div>
            <!-- 24热榜+专题推荐 -->
            <div class="goods-aside">
                <!-- 周日榜单 -->
                <!-- 只有字符串才不用加上： -->
                <DetailsHot :id="detailsData.id" :type="2" :limit="3" />
                <!-- 24 -->
                <DetailsHot :id="detailsData.id" :type="1" :limit="3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang='scss'>
.xtx-goods-page {
  .goods-info {
    min-height: 600px;
    background: #fff;
    display: flex;

    .media {
      width: 580px;
      height: 600px;
      padding: 30px 50px;
    }

    .spec {
      flex: 1;
      padding: 30px 30px 30px 0;
    }
  }

  .goods-footer {
    display: flex;
    margin-top: 20px;

    .goods-article {
      width: 940px;
      margin-right: 20px;
    }

    .goods-aside {
      width: 280px;
      min-height: 1000px;
    }
  }

  .goods-tabs {
    min-height: 600px;
    background: #fff;
  }

  .goods-warn {
    min-height: 600px;
    background: #fff;
    margin-top: 20px;
  }

  .number-box {
    display: flex;
    align-items: center;

    .label {
      width: 60px;
      color: #999;
      padding-left: 10px;
    }
  }

  .g-name {
    font-size: 22px;
  }

  .g-desc {
    color: #999;
    margin-top: 10px;
  }

  .g-price {
    margin-top: 10px;

    span {
      &::before {
        content: "¥";
        font-size: 14px;
      }

      &:first-child {
        color: $priceColor;
        margin-right: 10px;
        font-size: 22px;
      }

      &:last-child {
        color: #999;
        text-decoration: line-through;
        font-size: 16px;
      }
    }
  }

  .g-service {
    background: #f5f5f5;
    width: 500px;
    padding: 20px 10px 0 10px;
    margin-top: 10px;

    dl {
      padding-bottom: 20px;
      display: flex;
      align-items: center;

      dt {
        width: 50px;
        color: #999;
      }

      dd {
        color: #666;

        &:last-child {
          span {
            margin-right: 10px;

            &::before {
              content: "•";
              color: $xtxColor;
              margin-right: 2px;
            }
          }

          a {
            color: $xtxColor;
          }
        }
      }
    }
  }

  .goods-sales {
    display: flex;
    width: 400px;
    align-items: center;
    text-align: center;
    height: 140px;

    li {
      flex: 1;
      position: relative;

      ~li::after {
        position: absolute;
        top: 10px;
        left: 0;
        height: 60px;
        border-left: 1px solid #e4e4e4;
        content: "";
      }

      p {
        &:first-child {
          color: #999;
        }

        &:nth-child(2) {
          color: $priceColor;
          margin-top: 10px;
        }

        &:last-child {
          color: #666;
          margin-top: 10px;

          i {
            color: $xtxColor;
            font-size: 14px;
            margin-right: 2px;
          }

          &:hover {
            color: $xtxColor;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.goods-tabs {
  min-height: 600px;
  background: #fff;

  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;

      >span {
        color: $priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
    }
  }
}

.goods-detail {
  padding: 40px;

  .attrs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;

    li {
      display: flex;
      margin-bottom: 10px;
      width: 50%;

      .dt {
        width: 100px;
        color: #999;
      }

      .dd {
        flex: 1;
        color: #666;
      }
    }
  }

  >img {
    width: 100%;
  }
}

.btn {
  margin-top: 20px;

}

.bread-container {
  padding: 25px 0;
}
</style>