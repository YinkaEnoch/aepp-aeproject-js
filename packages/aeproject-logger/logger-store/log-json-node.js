const path = require('path')
const fs = require('fs-extra')

const storageDir = '../../.aeproject-node-store/.node-store.json'
const dockerConfig = 'docker-compose.yml'
const compilerConfig = 'docker-compose.compiler.yml'

let instance

class LogJSONNode {
    constructor (_path) {
        this.nodeStore = path.resolve(`${ path.dirname(require.main.filename) }/${ storageDir }`)
        
        this.dockerComposePath = _path + '/';
        this.compilerPath = _path + '/'

        if (this.ensureStoreExists()) {
            
            fs.outputJsonSync(this.nodeStore, {
                node: this.dockerComposePath,
                compiler: this.compilerPath
            });
        }

        this.store = require(this.nodeStore)
    }

    ensureStoreExists () {
        return !fs.existsSync(this.nodeStore)
    }

    async writeNodePathToStore () {
        this.store.node = this.dockerComposePath + dockerConfig
        await this.save()
    }

    async writeCompilerPathToStore () {
        this.store.compiler = this.compilerPath + compilerConfig
        await this.save()
    }

    writeNodeAndCompilerToStore () {
        this.writeNodePathToStore()
        this.writeCompilerPathToStore()
        console.log('>>>> 1 this.store', this.store);
        
    }

    async deleteCompilerPathFromStore () {
        this.store.compiler = "";
        await this.save()
    }

    async deleteNodePathFromStore () {
        this.store.node = "";
        await this.save()
    }
    async clearPaths () {
        this.store = {}
        await this.save()
    }

    getNodePath () {
        console.log('this.nodeStore path on geth>>>>>>>>>');
        console.log(this.nodeStore);
        console.log('=====================');
        
        console.log('node path saved in the nodeStore >>>>>>>>>');
        console.log(this.store.node);
        console.log('=====================');

        return this.store.node
    }

    getCompilerPath () {
        return this.store.compiler
    }

    async save () {
        console.log('on save method');
        
        console.log('node store path ==>>>>>', this.nodeStore);
        console.log('node path saved ==>>>>>', this.store.node);

        await fs.outputJsonSync(this.nodeStore, this.store);
    }

    static getInstance (_path) {

        if (!instance) {
            instance = new LogJSONNode(_path)
        }

        return instance
    }

}

module.exports = function (_path) {
    return LogJSONNode.getInstance(_path)
}