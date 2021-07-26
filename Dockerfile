FROM nginx:latest
RUN ls -las
COPY ./build /usr/share/nginx/html/
EXPOSE 80