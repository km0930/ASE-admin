<template>
  <q-timeline dark color="secondary">
    <q-timeline-entry heading>Review</q-timeline-entry>
    <q-timeline-entry title="Basic Information" icon="article">
      <div>
        <q-list bordered dark>
          <q-item>
            <q-item-section avatar>Name :</q-item-section>
            <q-item-section>
              <q-item-label v-if="data.name">{{ data.name }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="done" color="green" v-if="data.name" />
              <q-icon name="clear" color="red" v-if="!data.name" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>Approx Time :</q-item-section>
            <q-item-section>
              <q-item-label v-if="data.approxTime">{{ data.approxTime }} Minutes</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="done" color="green" v-if="data.approxTime" />
              <q-icon name="clear" color="red" v-if="!data.approxTime" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>Documentation file Name :</q-item-section>
            <q-item-section>
              <q-item-label v-if="data.documentation">
                <label v-for="(consin, index) in data.documentation" v-bind:key="index">
                  {{ consin.label }}
                </label>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="done" color="green" v-if="data.documentation" />
              <q-icon name="clear" color="red" v-if="!data.documentation" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>Description :</q-item-section>
            <q-item-section>
              <q-item-label v-if="data.description">{{ data.description }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="done" color="green" v-if="data.description" />
              <q-icon name="clear" color="red" v-if="!data.description" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-timeline-entry>
    <q-timeline-entry title="Configuration" icon="build">
      <div>
        <q-list bordered dark>
          <q-item>
            <q-item-section avatar>Image Name :</q-item-section>
            <q-item-section>
              <q-item-label v-if="data.imageName?.value">{{ data.imageName?.value }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="done" color="green" v-if="data.imageName?.value" />
              <q-icon name="clear" color="red" v-if="!data.imageName?.value" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>Image Configuration :</q-item-section>
            <q-item-section>
              <q-item-label v-if="data.configuration">{{ data.configuration }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="done" color="green" v-if="data.configuration" />
              <q-icon name="clear" color="red" v-if="!data.configuration" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>Image Region :</q-item-section>
            <q-item-section>
              <q-item-label v-if="typeof data.region?.value === 'object'">{{ data.region?.value.toString() }}</q-item-label>
              <q-item-label v-else-if="typeof data.region?.value === 'string'">{{ data.region?.value }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="done" color="green" v-if="data.region?.value" />
              <q-icon name="clear" color="red" v-if="!data.region?.value" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>Lab Time :</q-item-section>
            <q-item-section>
              <q-item-label v-if="data.labTime">{{ data.labTime }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="done" color="green" v-if="data.labTime" />
              <q-icon name="clear" color="red" v-if="!data.labTime" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-timeline-entry>
    <q-timeline-entry title="Cloud" icon="cloud" v-if="cloudInfo.isCloud || false">
      <div>
        <q-list bordered dark>
          <q-item>
            <q-item-section avatar>Cloud Type :</q-item-section>
            <q-item-section>
              <q-item-label v-if="cloudInfo.cloudType ? cloudInfo.cloudType.label : false">{{ cloudInfo.cloudType.label }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="cloudInfo.cloudType ? cloudInfo.cloudType.label === 'AWS' : false">
            <q-item-section avatar v-if="cloudInfo.cloudType ? cloudInfo.cloudType.label === 'AWS' : false">AWS OU ID :</q-item-section>
            <q-item-section>
              <q-item-label v-if="cloudInfo.awsOuId ? cloudInfo.awsOuId.label : false">{{ cloudInfo.awsOuId.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-timeline-entry>
  </q-timeline>
</template>

<script>
export default {
  name: 'TimeLine',
  props: ['data', 'cloudInfo']
}
</script>
