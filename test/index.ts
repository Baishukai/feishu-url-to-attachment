import { testField, createFieldContext } from "@lark-opdev/block-basekit-server-api";

async function run() {
    const context = await createFieldContext();
    testField({
        account: 100,
    }, {
        ...context,
        token: context.token ?? '',  // 提供默认值以满足 FieldContext 类型要求
    });
}

run();
