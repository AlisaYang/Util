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


// 两个数组交集
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function(nums1, nums2) {
    nums1.sort((a, b) => {
        return a - b;
    })
    nums2.sort((a, b) => {
        return a - b;
    })

    let i = 0;
    let j = 0;
    let array = []

    // 双指针; 始终移动数值比较小的指针下标
    while(i < nums1.length && j < nums2.length) {
        if (nums1[i] == nums2[j]) {
            array.push(nums1[i])
            i++
            j++
        } else {
            nums1[i] < nums2[j] ? i++ : j++
        }
    }

    return array
};

// intersect([1,2,2,1], [2,2])
// [2,2]



// 数字数组加一
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
    // 如果超过16位精度数字，需要用BigInt来转化成数字
    let number = BigInt(digits.join('')) + BigInt(1)
        number = number + ''.split('n')[0]
    let arr = []
    
    for (let i = 0; i < number.length; i++) {
        arr.push(number[i])
    }
    return arr
};

// plusOne([1,2,3])
// [1,2,4]