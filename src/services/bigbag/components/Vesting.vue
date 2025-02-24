<template>
  <fragment>
    <h2>Vesting grants for {{ $robonomics.account.address }}</h2>
    <ContractForm ref="form" @onChange="onChange" @onSubmit="handleSubmit" />
    <template v-if="isLoad">...</template>
    <template v-else>
      <template v-if="isCorrect">
        <h3>
          Contract
          <a
            :href="`https://etherscan.io/address/${addressContract}#readContract`"
            target="_blank"
          >
            {{ addressContract }}
          </a>
        </h3>
        <div v-if="grants.length == 0">Not found grants.</div>
        <div v-else v-for="(grant, index) in grants" :key="index">
          <h4>Grant</h4>
          <div>
            Start time: <b>{{ $filters.dateFormat(grant.startTime) }}</b>
          </div>
          <div>
            Amount: <b>{{ $filters.fromWei(grant.amount, 9, "XRT") }}</b>
          </div>
          <!-- <div>
            Days claimed: <b>{{ grant.daysClaimed }}</b>
          </div>
          <div>
            Total claimed: <b>{{ $filters.fromWei(grant.totalClaimed, 9, "XRT") }}</b>
          </div> -->
          <div>
            Vesting duration: <b>{{ grant.vestingDuration }} days</b>
          </div>
          <div>
            Vesting cliff: <b>{{ grant.vestingCliff }} days</b>
          </div>
          <h4>Claim</h4>
          <div>
            Days vested: <b>{{ grant.daysVested }}</b>
          </div>
          <div>
            Amount vested:
            <b>{{ $filters.fromWei(grant.amountVested, 9, "XRT") }}</b>
          </div>
          <div></div>
          <Claim
            v-if="Number(grant.amountVested) > 0"
            :address="addressContract"
            :index="grant.index"
            @success="getInfoVesting"
          />

          <RButton
            v-else
            size="big"
            fullWidth
            disabled
            style="margin-bottom: 25px"
            >Send transaction
          </RButton>
          <hr />
        </div>
      </template>
    </template>
  </fragment>
</template>

<script>
import Claim from "./Claim";
import ContractForm from "./ContractForm";
import VestingAbi from "../abi/Vesting.json";

export default {
  props: ["address"],
  components: {
    Claim,
    ContractForm
  },
  data() {
    return {
      isLoad: true,
      isCorrect: false,
      grants: [],
      addressContract: this.address
    };
  },
  mounted() {
    this.$refs.form.fields.address.value = this.address;
    this.getInfoVesting();
  },
  methods: {
    onChange() {
      this.$refs.form.submit();
    },
    handleSubmit({ error, fields }) {
      if (!error) {
        if (this.addressContract != fields.address.value) {
          this.addressContract = fields.address.value;
          this.getInfoVesting();
        }
      } else {
        this.addressContract = "";
      }
    },
    async getInfoVesting() {
      console.log("up vest");
      this.isLoad = true;
      const contract = new this.$robonomics.web3.eth.Contract(
        VestingAbi,
        this.addressContract
      );
      try {
        const grantIndexes = await contract.methods
          .getActiveGrants(this.$robonomics.account.address)
          .call();

        this.grants = [];
        for (const index of grantIndexes) {
          const grant = await contract.methods.tokenGrants(index).call();
          const calc = await contract.methods.calculateGrantClaim(index).call();

          this.grants.push({
            index: index,
            amount: grant.amount,
            daysClaimed: grant.daysClaimed,
            startTime: grant.startTime,
            totalClaimed: grant.totalClaimed,
            vestingCliff: grant.vestingCliff,
            vestingDuration: grant.vestingDuration,
            daysVested: calc["0"],
            amountVested: calc["1"]
          });
        }

        this.isCorrect = true;
      } catch (_) {
        this.isCorrect = false;
      }
      this.isLoad = false;
    }
  }
};
</script>
