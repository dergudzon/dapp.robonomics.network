<template>
  <Page>
    <section>
      <h2 class="breadcrumbs m-b-0">
        <span>
          <span class="i-signal m-r-10"></span>
          <span>{{ $t("sensors.title") }}</span>
        </span>
        <i>/</i>
        <span>{{ nameModel }} {{ miniAddrAgent }}</span>
      </h2>
      <modals-container />
      <template v-if="robonomics">
        <SensorResult
          v-if="result"
          :lighthouse="lighthouse"
          :model="model"
          :agent="agent"
          :result="result"
        />
        <SensorResultSubstrate
          v-if="substrateBlock"
          :lighthouse="lighthouse"
          :model="model"
          :agent="agent"
          :substrateBlock="substrateBlock"
          :substrateTx="substrateTx"
        />
        <SensorCost
          v-else-if="cost > 0"
          :lighthouse="lighthouse"
          :model="model"
          :agent="agent"
          :tokenAddress="token"
          :cost="cost"
        />
        <SensorFree
          v-else
          :lighthouse="lighthouse"
          :model="model"
          :agent="agent"
          :result="result"
        />
      </template>
      <template v-else>
        <div v-if="error" class="red">{{ error }}</div>
        <div v-else>...</div>
      </template>
    </section>
  </Page>
</template>

<script>
import Page from "@/components/layout/Page";
import SensorFree from "./SensorFree";
import SensorCost from "./SensorCost";
import SensorResult from "./SensorResult";
import SensorResultSubstrate from "./SensorResultSubstrate";
import config from "~config";
// import { Robonomics } from "@/utils/robonomics-substrate";
// import { createInstance } from "@/utils/substrate";
import { getInstance } from "@/utils/substrate";
import configService from "../config";

export default {
  props: [
    "lighthouse",
    "model",
    "agent",
    "result",
    "substrateBlock",
    "substrateTx",
    "token",
    "cost"
  ],
  components: {
    Page,
    SensorFree,
    SensorCost,
    SensorResult,
    SensorResultSubstrate
  },
  data() {
    return {
      robonomics: null,
      error: null
    };
  },
  computed: {
    miniAddrAgent: function () {
      return this.agent.slice(0, 6) + "..." + this.agent.slice(-4);
    },
    nameModel: function () {
      return Object.prototype.hasOwnProperty.call(
        config.CATEGORY_MODELS,
        this.model
      )
        ? config.CATEGORY_MODELS[this.model]
        : "unknown";
    }
  },
  async created() {
    document.title = `${this.$t("sensors.title")} ${
      this.nameModel
    } – Robonomics Network dApp`;
    try {
      this.robonomics = await getInstance(configService.CHAIN);
    } catch (error) {
      this.error = error.message;
    }
  }
};
</script>
