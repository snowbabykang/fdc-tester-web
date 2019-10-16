<template>
    <section class="content-white-box">
        <approveStep :currentStep="3"></approveStep>
        <placeBranch />
    </section>
</template>

<script>
import approveStep from '../components/approveStep'
import placeBranch from '../components/placeBranch'
export default {
    data () {
        return {
        }
    },
    components: {
        approveStep,placeBranch
    },
    methods: {
        
    },
}
</script>
<style scoped>

</style>
