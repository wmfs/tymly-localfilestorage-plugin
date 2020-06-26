## [1.1.1](https://github.com/wmfs/tymly-localfilestorage-plugin/compare/v1.1.0...v1.1.1) (2020-06-26)


### 🐛 Bug Fixes

* Register with cloud-provider by name ([2904eb4](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/2904eb43dfabb39aa5b4ff8b5e2e0bcc6d483c9b))
* Specify local provider in download state-machine ([2934d7e](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/2934d7ef66abcd7ca28064febd89202a78a959c5))


### 🚨 Tests

* boot is now async. Correct tests ([c9083d2](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/c9083d2dc393d5cdb368efb45b84a90224381ff4))

# [1.1.0](https://github.com/wmfs/tymly-localfilestorage-plugin/compare/v1.0.0...v1.1.0) (2020-06-22)


### ✨ Features

* Fill out downloadFromLocalFileStorage blueprint. ([3ab1c86](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/3ab1c8603a6db597795264864c5e117305c8ca08))
* **service:** Extend listFolderContentsFromPath to include full remote path of file, and launches f ([eba19c6](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/eba19c634edc95465f2f709263db0843d2964f29))
* Blueprint to support direct file downloading ([60bb00c](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/60bb00c54bfeafc2c38a85e3f53c8e5088142c4a))


### 🐛 Bug Fixes

* **download state-machine:** Change downloadUrl output to downloadPath ([3170018](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/31700181c0c045bcc0a4f04ce3335507fc759cb8))
* Extend listFolderContentsFromPath to include launches pointing to download blueprint ([fb0b9e7](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/fb0b9e7c1922690799b4b4a9f98a5c23578dd365))
* **ensureFolderPath:** Correct return value ([9519958](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/9519958b134263adf9bc2f351448fb6b30fb2f5d))
* **service:** Extend copyFileToRemotePath to take remote file name parameter ([cfbf9da](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/cfbf9da9a0f4396c1d298ec6276c3c4fb0d7cd01))


### 🚨 Tests

* Correct tests - needs temp service to boot ([647514b](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/647514bceaa6398794d4c661eac1335c58b70c72))
* Corrected test name ([62ab625](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/62ab62544820f4ff27557d426fd48572473d15ec))
* service boot is now async. Correct tests ([e7737da](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/e7737dabefa2d16fb53884c6b67c6c240518ce2e))
* **copyFileToRemotePath:** Test copy to remote when we specify the filename as well as the folder ([caeaa01](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/caeaa017134c3c7bcddeaacc1177714cc0243652))

# 1.0.0 (2020-06-03)


### ✨ Features

* **copyFileToRemotePath:** Return correct remote path to file ([65d029e](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/65d029e234a54ba29dea98ae0b5ee781811df87f))
* **service:** copyFileToLocalPath ([101e239](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/101e2397cc299a29acb809174dd47e9b6dffac86))
* **service:** ensureFolderPath ([12a0aea](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/12a0aea8eb898bce0c11d86d0baa3cd2d4801775))
* **service:** ensureFolderPath ([304a3ac](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/304a3ac25f9c2a48746c5df97300f01f972773bb))
* **service:** listFolderContentsFromPath ([4b418aa](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/4b418aae2a233939bbcbffa0dc54c5d0337085cd))
* **service:** listFolderContentsFromPath ([702a42e](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/702a42e671c0e80854e02bdfb695036f23d80279))
* **service:** listFolderContentsFromPath returns empty list for bad paths ([1b90b09](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/1b90b09481d9248b968e9306e09f3d2d644b21ee))
* **service:** Service skeleton - provider boots up ([56883ad](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/56883ad040b30397bbf1064ddb01cf59a087cff1))
* **service:** Starting on copyFileToRemotePath ([1635997](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/16359979b8f0fbea3d22db73726cd63978beab5a))
* **service:** Validate root path is absolute, exists and is readable and writable ([3f215d5](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/3f215d5f3d191e82e3173e2cce801b67d21a1a3a))


### 🐛 Bug Fixes

* **service:** Check cloudstorage service before trying to register ([b15a4c5](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/b15a4c51ab0abdd00037fa4a8f7060828e198c9d))
* **service:** Pick up config, then register ([249053f](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/249053fbc9bc99fa0ac72ec00cc026de17773c67))
* **version_plugin:** Fixed github url in version_plugin ([a0403f8](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/a0403f8a23eca136173db2effa9b9628e5e9ccdc))


### 🛠 Builds

* Add main so tymly boots up properly. ([96ca69b](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/96ca69bbd3588cb8e199896bae8c92cb08756d6f))
* Plugin skeleton ([772d5d5](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/772d5d51d25ec77d89dcd43f9c6879f0f6ef0350))


### 📦 Code Refactoring

* **tests:** refactor tests ([245bb63](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/245bb632c4bedabbdb9b7f466a6c58746b7d63aa))


### 🚨 Tests

* Ensure empty directory is present ([7702d56](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/7702d56c73b5229947f819d6a47c6ca9f4f981cf))
* Pull methods tests out into their own files. Easier to manage before/after setup and teardown ([7a1be9a](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/7a1be9afb2ee6efc7c7ed1c9727986e0ceecf3ff))
* Remaining copyFileToRemotePath tests ([c0bcfb3](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/c0bcfb327bb3bd156be251a7e5272f47aafa1d3f))
* **service:** Boot config tests ([1e6102a](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/1e6102a23d391d34007ca23a90ae1ddad07074cd))
* **service:** boot failure test ([0ce144a](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/0ce144a45ea62c6a1ef9b94b427bea81dd5edb43))
* **service:** first couple of ensureFolderPath tests ([192d227](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/192d2272b82d9374228124b9c27deddb32dedb93))
* **service:** Test configured path is absolute and exists ([f769d6c](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/f769d6ceb1aec644277bbc99e3cac797d5cb1569))


### 💎 Styles

* **lint:** lint fixes ([4c4b884](https://github.com/wmfs/tymly-localfilestorage-plugin/commit/4c4b884014d02eb308a7a40830d6696cf95b9f96))
