FROM nginx:latest
COPY ./build /usr/share/nginx/html/
COPY ./nginx-docker.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD cd /usr/share/nginx/html && \
find . -type f -exec sed -i 's%\$\$CBI_STRIPE_KEY\$\$%'"$CBI_STRIPE_KEY"'%g' {} + && \
find . -type f -exec sed -i 's%\$\$CBI_SENTRY_DSN\$\$%'"$CBI_SENTRY_DSN"'%g' {} + && \
find . -type f -exec sed -i 's%\$\$CBI_HOST_NAME\$\$%'"$CBI_HOST_NAME"'%g' {} + && \
find . -type f -exec sed -i 's%\$\$CBI_PORT\$\$%'"$CBI_PORT"'%g' {} + && \
find . -type f -exec sed -i 's%\$\$INSTANT_SUDO\$\$%'"$INSTANT_SUDO"'%g' {} + && \
find . -type f -exec sed -i 's%\$\$CBI_APEX_URL\$\$%'"$CBI_APEX_URL"'%g' {} + && \
nginx -g 'daemon off;'
