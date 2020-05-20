//  https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
const model = {methods:[],fields:[]};
const isModuleExports = (path,state) => {
    return path.node.object.name == "module" && path.node.property.name == "exports";
}
module.exports = function({types:t}){
    return {
        visitor:{
            MemberExpression(path,state){
                if( ! isModuleExports(path,state)) return;
                let assignment = path.findParent((path)=>path.isAssignmentExpression());
                let right = assignment.get('right');
                console.log(assignment,right.node);
                /*if(right.isObjectExpression()){
                    model.name = '[Object]';
                    let properties = right.get('properties');
                    console.log(properties[0].get('key').get('name'));
                } else if(right.isFunctionDeclaration()){
                    model.name = '[Function]';
                } else {
                    console.log(right.type);
                }*/
            }
        }
    }
}