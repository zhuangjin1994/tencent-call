FROM nginx
RUN mkdir -p /opt/nginx/tencent-call

# 宿主机文件添加入容器
COPY dist/ /opt/nginx/tencent-call/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf