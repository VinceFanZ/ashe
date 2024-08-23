// 题目一：
/**
 * 说明：
 *   写个转换函数，把一个JSON对象的key从下划线形式（Pascal）转换到小驼峰形式（Camel）
 * 示例：
 *   converter({"a_bc_def": 1}); // 返回 {"aBcDef": 1}
 */

function converter(obj) {
  /* 功能实现 */
  const result = {}
  Object.keys(obj).forEach(key => {
    const newKey = key.replace(/_([a-z])/g, (match, p1) => {
      return p1.toUpperCase()
		})
    result[newKey] = obj[key]
  })
  
  return result
}

converter({"a_bc_def": 1});

// 题目二：
// 不使用数组的 arr.flat() API，自己实现一个数组拍平函数，需要支持任意层级
const arr = ['hi',['hello',1],2,[3,[4,[5]]]]
function flat(list, depth=1) {
  const result = []

  for(let i=0; i < list.length; i++) {
    if (Array.isArray(list[i]) && depth > 0) {
      result.push(...flat(list[i], depth-1))
    } else {
      result.push(list[i])
    }
  }

  return result
}
flat(arr);
// 默认展开一层
// ["hi","hello",1,2,3,[4,[5]]]
flat(arr, 3);
// 第二个参数支持控制层级
// ['hi', 'hello', 1, 2, 3, 4, 5]

// 题目三：
// 输入项
const itemList = [
  {
    id: 4,
    paramName: '供应链属性',
    parentId: 0
  },
  {
    id: 2,
    paramName: '供应链属性',
    parentId: 4
  },
  {
    id: 5,
    paramName: '供应链属性',
    parentId: 0
  },
  {
    id: 6,
    paramName: '供应链属性',
    parentId: 5
  }
];

buildTree(itemList);

/**
* 补充下面函数，函数返回示例如下
* @param {ItemList} arr
*	@return {ItemTreeNode[]}
**/
function buildTree(arr) {
  const result = []
  const childrens = []
  
  arr.forEach((item) => {
    if (item.parentId === 0) {
      result.push({ ...item, children: [] })
    } else {
      childrens.push(item)
    }
  })
  
  childrens.forEach((item) => {
    const parent = result.find(node => node.id === item.parentId)
    parent.children.push(item)
  })
  
  return result
}

// ==========> 函数返回示例
// [
//   {
//     id: 4,
//     paramName: '供应链属性',
//     parentId: 0,
//     children: [
//       {
//         id: 2,
//         paramName: '供应链属性',
//         parentId: 4,
//       },
//     ],
//   },
//     {
//     id: 5,
//     paramName: '供应链属性',
//     parentId: 0,
//     children: [
//       {
//         id: 6,
//         paramName: '供应链属性',
//         parentId: 5,
//       },
//     ],
//   },
// ];

// 题目四：
// 实现一个方法，检查一个 npm 包的依赖项中有没有存在循环依赖。
// 不用考虑版本，只考虑包名即可
// 入参 pkgs 为项目中所有的依赖（包括子依赖）
// 返回 boolean
// pkg 数据结构即为 package.json 内容的数组, 如有三个包 a、b、c 则入参为：
const package = [
  {
    "name": "a",
    "dependencies": {
      "b": "^1.0.0"
    }
  },
  {
    "name": "b",
    "dependencies": {
      "c": "^1.0.0"
    }
  },
  {
    "name": "c",
    "dependencies": {
      "a": "^1.0.0"
    }
  }
]
function hasCycle (pkgs) {
  const graph = new Map()
  const inDegree = new Map()
  
  pkgs.forEach(pkg => {
    const name = pkg.name
    graph.set(name, new Set())
    inDegree.set(name, 0)
  })
  
  pkgs.forEach(pkg => {
    const name = pkg.name
    Object.keys(pkg.dependencies).forEach(depName => {
      if (graph.has(name) && graph.has(depName)) {
        graph.get(depName).add(name)
        inDegree.set(name, inDegree.get(name) + 1)
      }
    })
  })

  const queue = []
  inDegree.forEach((val, key) => {
    if (val === 0) {
      queue.push(key)
    }
  })

  let count = 0
  while (queue.length) {
    const node = queue.shift()
    count++

    if (graph.has(node)) {
      graph.get(node).forEach((item) => {
        const newInDegree = inDegree.get(item) - 1
        inDegree.set(item, newInDegree)
        if (newInDegree === 0) {
          queue.push(item)
        }
      })
    }
  }

  return count !== graph.size
}

hasCycle(package)
