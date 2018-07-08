/**
 * Created by Sorrow.X on 2018/6/26.
 */
 
import Vue from 'vue'
import electron from 'electron'
const ipc = electron.ipcRenderer

Vue.mixin({
    created: function() {
        let self = this
        let Type = (function() {
            let Type = {}
            for (let i = 0, type; (type = ["Undefined", "Null", "Boolean", "Number", "String", "Function", "Array", "Object"][i++]);) {
                (function(type) {
                    Type["is" + type] = function(obj) {
                        return Object.prototype.toString.call(obj) === "[object " + type + "]"
                    }
                })(type)
            }
            return Type
        })()

        this.$_live_type = Type

        // use: this.$getChildComponent(this.$root, 'xx-xx')
        this.$_live_getChildComponent = function(vueInstance, componentTag) {
            let component = null
            let allComp = getAllChildComp(vueInstance)

            let i = allComp.findIndex(function(vm) {
                return vm.$options._componentTag === componentTag
            })
            if (i !== -1) {
                component = allComp[i]
            }
            return component

            function getAllChildComp(instance) {
                let allComp = [],
                    child
                if (Type.isObject(instance)) {
                    child = instance.$children
                } else if (Type.isArray(instance)) {
                    child = instance
                }
                for (let i = 0; i < child.length; i++) {
                    allComp.push(child[i])
                    if (child[i].$children.length > 0) {
                        // 还有孩子
                        allComp = allComp.concat(getAllChildComp(child[i].$children))
                    }
                }
                return allComp
            }
        }

        this.$closeWin = function() {
            ipc.send('window-close')
        }

        this.$minWin = function() {
            ipc.send('window-min')
        }

        this.$maxWin = function() {
            ipc.send('window-max')
        }
    }
})

