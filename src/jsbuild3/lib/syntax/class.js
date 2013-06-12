/**
 * Created with JetBrains WebStorm.
 * User: C01t
 * Date: 2/12/13
 * Time: 9:49 AM
 * To change this template use File | Settings | File Templates.
 */

function ClassCompiler(ns, node, descend) {
    if (node instanceof UglifyJS.AST_Call && node.expression.print_to_string() == 'CLASS') {

        console.info(node.args);

        var tkz = new ria.__SYNTAX.Tokenizer(node.args);

        var def = ria.__SYNTAX.parseClassDef(tkz);

        //ria.__SYNTAX.validateClassDecl(def);

        console.info('found class ' + def.name + ' in ' + ns);

        return make_node(UglifyJS.AST_BlockStatement, node, { body: []});
    }
}

compilers.push(ClassCompiler);