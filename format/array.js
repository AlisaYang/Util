// 数组操作

// 升序数组删除重复的元素，并返回数组
// 双指针解法
function removeDuplicates(array) {
    if (!array || !array.length) return array;

    let left = 0;
    let arr = []

    for(let right = 1; right < array.length; right++ ){

        //如果左指针和右指针指向的值一样，说明有重复的，
        //这个时候，左指针不动，右指针继续往右移。如果他俩
        //指向的值不一样就把右指针指向的值往前挪

        if (array[left] != array[right]) {
            array[++left] = array[right]
        }
    }
    for (let i = 0; i < left + 1; i++) {
        arr.push(array[i])
    }


    return arr
}

// removeDuplicates([1,1,2])



// 翻转数组 start 开始下标 end 结束下标
function reverse(array, start, end) {
    while(start < end) {
        let s = array[start]

        array[start++] = array[end]
        array[end--] = s
    }

    return array
}

// reverse([1,2,3,4], 0, 3)
// (4) [4, 3, 2, 1]



// 旋转数组

// 输入: nums = [1,2,3,4,5,6,7], k = 3
// 输出: [5,6,7,1,2,3,4]
// 解释:
// 向右轮转 1 步: [7,1,2,3,4,5,6]
// 向右轮转 2 步: [6,7,1,2,3,4,5]
// 向右轮转 3 步: [5,6,7,1,2,3,4]
function rotate(array, index) {
    let len = array.length

    // 防止下标大于数组长度而出现undefined
    index %= len    

    array = reverse(array, 0, len - 1)
    array = reverse(array, 0, index - 1)
    array = reverse(array, index, len - 1)

    return array
}

// rotate([1,2,3,4,5,6,7], 3)
// (7) [5, 6, 7, 1, 2, 3, 4]