<template>
  <Suspense>
    <router-view #default />
    <template #fallback>로딩 중...</template>
  </Suspense>
</template>
