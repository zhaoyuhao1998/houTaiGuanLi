var removeDuplicates = function(nums) {
  let i=0, j=0, len=nums.length, cnt=0, res=0, pre=nums[0]
  while (j < len) {
      if (nums[j]===pre && cnt<2) {
          nums[i] = nums[j]
          cnt++
          i++
          j++
          res++
          pre = nums[i-1]
      } else if (nums[j]===pre && cnt>=2) {
          j++
      } else if (nums[j] != pre) {
          cnt = 1
          nums[i] = nums[j]
          i++
          j++
          res++
          pre = nums[i-1]
      }
  }
  console.log(nums)
};

removeDuplicates([0,0,1,1,1,1,2,3,3])
