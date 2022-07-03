# Docker Build (for Swish-Web)

> This is a really confoluted process at the moment. It will ideally be cleaned up.

```bash
cd Plugins
npm run build
npm run pack
mv *.tgz ../Base
cd ../Base
# Edit the package.json to use the tgz rather than the path
npm run build
npm run pack
mv *tgz ../Web
cd ../Web
# Edit the package.json to use the tgz rather than the path - only for swish-base
npm run build
docker build . -t thealternator89/swish-web:{{tag}}
docker push thealternator89/swish-web:{{tag}}
```
