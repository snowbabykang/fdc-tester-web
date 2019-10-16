<template>
    <section class="content-white-box">
        <approveStep :currentStep="1"></approveStep>
        <qualityCertificate  />
    </section>
</template>

<script>
import approveStep from '../components/approveStep'
import qualityCertificate from '../components/qualityCertificate'
export default {
    data () {
        return {
            
        }
    },
    components: {
        approveStep,qualityCertificate
    },
}
</script>
<style scoped>

</style>
