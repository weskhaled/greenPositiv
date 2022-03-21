<script setup lang="ts">
const formStateIbanModule = ref()
const onFinishFailed = ref()
const onFinish = ref()
const validateInfosIbanModule = ref()

</script>
<template>
  <div>
    <div class="p-4">
      <div class="max-w-md mx-auto">
        <a-form
          layout="vertical"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
          :model="formStateIbanModule"
          @finish-failed="onFinishFailed"
          @finish="onFinish"
        >
          <a-form-item
            label="Nom et prénom"
            v-bind="validateInfosIbanModule.cb_iban_name_lastname"
          >
            <a-input
              v-model:value="formStateIbanModule.cb_iban_name_lastname"
              @blur="validate('cb_iban_name_lastname', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Adresse du titulaire"
            v-bind="validateInfosIbanModule.cb_iban_address_holder"
          >
            <a-input
              v-model:value="formStateIbanModule.cb_iban_address_holder"
              @blur="validate('cb_iban_address_holder', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Code postal"
            v-bind="validateInfosIbanModule.cb_iban_postal"
          >
            <a-input
              v-model:value="formStateIbanModule.cb_iban_postal"
              @blur="validate('cb_iban_postal', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Ville"
            v-bind="validateInfosIbanModule.cb_iban_city"
          >
            <a-input
              v-model:value="formStateIbanModule.cb_iban_city"
              @blur="validate('cb_iban_city', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <!-- form items iban -->
          <a-form-item
            label="Pays"
            v-bind="validateInfosIbanModule.cb_iban_country"
          >
            <a-select
              v-model:value="formStateIbanModule.cb_iban_country"
              placeholder="Pays"
              :options="countriesIban"
            />
          </a-form-item>
          <a-form-item
            label="IBAN"
            v-bind="validateInfosIbanModule.cb_iban_iban"
          >
            <a-input
              v-model:value="formStateIbanModule.cb_iban_iban"
              @blur="validate('cb_iban_iban', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <!-- end form items iban -->
          <!-- here select type_iban  values { type_iban: iban / iban-us /iban-ca / others} -->
          <!-- form items iban US -->
          <a-form-item
            label="Pays"
            v-bind="validateInfosIbanUsModule.cb_iban_country"
          >
            <a-select
              v-model:value="formStateIbanUsModule.cb_iban_country"
              placeholder="Pays"
              :options="countriesIbanOthers"
            />
          </a-form-item>
          <a-form-item
            label="Région"
            v-bind="validateInfosIbanUsModule.cb_iban_region"
          >
            <a-input
              v-model:value="formStateIbanUsModule.cb_iban_region"
              @blur="validate('cb_iban_region', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Ville"
            v-bind="validateInfosIbanUsModule.cb_iban_city"
          >
            <a-input
              v-model:value="formStateIbanUsModule.cb_iban_city"
              @blur="validate('cb_iban_city', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Numéro de compte"
            v-bind="validateInfosIbanUsModule.cb_iban_account_number"
          >
            <a-input
              v-model:value="formStateIbanUsModule.cb_iban_account_number"
              @blur="validate('cb_iban_account_number', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="ABA Transit number"
            v-bind="validateInfosIbanUsModule.cb_iban_aba_transit_number"
          >
            <a-input
              v-model:value="formStateIbanUsModule.cb_iban_aba_transit_number"
              @blur="validate('cb_iban_aba_transit_number', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Type de compte"
            v-bind="validateInfosIbanUsModule.cb_iban_account_type"
          >
            <a-select
              v-model:value="formStateIbanUsModule.cb_iban_account_type"
              :options="typesAccount"
            />
          </a-form-item>
          <!-- end form items iban us-->
          <!-- form items iban ca  -->
          <a-form-item
            label="Pays"
            v-bind="validateInfosIbanCaModule.cb_iban_country"
          >
            <a-select
              v-model:value="formStateIbanCaModule.cb_iban_country"
              placeholder="Pays"
              :options="countriesIbanOthers"
            />
          </a-form-item>
          <a-form-item
            label="Région"
            v-bind="validateInfosIbanCaModule.cb_iban_region"
          >
            <a-input
              v-model:value="formStateIbanCaModule.cb_iban_region"
              @blur="validate('cb_iban_region', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Ville"
            v-bind="validateInfosIbanCaModule.cb_iban_city"
          >
            <a-input
              v-model:value="formStateIbanCaModule.cb_iban_city"
              @blur="validate('cb_iban_city', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Nom de la banque"
            v-bind="validateInfosIbanCaModule.cb_iban_bank_name"
          >
            <a-input
              v-model:value="formStateIbanCaModule.cb_iban_bank_name"
              @blur="validate('cb_iban_bank_name', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Numéro de compte"
            v-bind="validateInfosIbanCaModule.cb_iban_account_number"
          >
            <a-input
              v-model:value="formStateIbanCaModule.cb_iban_account_number"
              @blur="validate('cb_iban_account_number', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Code guichet"
            v-bind="validateInfosIbanCaModule.cb_iban_branch_code"
          >
            <a-input
              v-model:value="formStateIbanCaModule.cb_iban_branch_code"
              @blur="validate('cb_iban_branch_code', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Numéro d\'institution"
            v-bind="validateInfosIbanCaModule.cb_iban_number_institution"
          >
            <a-input
              v-model:value="formStateIbanCaModule.cb_iban_number_institution"
              @blur="validate('cb_iban_number_institution', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <!-- end form items iban ca -->
          <!-- form items iban BIC SWIFT -->
          <a-form-item
            label="Pays"
            v-bind="validateInfosIbanOthersModule.cb_iban_country"
          >
            <a-select
              v-model:value="formStateIbanOthers.cb_iban_country"
              :options="countriesIbanOthers"
            />
          </a-form-item>
          <a-form-item
            label="Région"
            v-bind="validateInfosIbanOthersModule.cb_iban_region"
          >
            <a-input
              v-model:value="formStateIbanOthers.cb_iban_region"
              @blur="validate('cb_iban_region', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Ville"
            v-bind="validateInfosIbanOthersModule.cb_iban_city"
          >
            <a-input
              v-model:value="formStateIbanOthers.cb_iban_city"
              @blur="validate('cb_iban_city', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Numéro de compte"
            v-bind="validateInfosIbanOthersModule.cb_iban_account_number"
          >
            <a-input
              v-model:value="formStateIbanOthers.cb_iban_account_number"
              @blur="validate('cb_iban_account_number', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Numéro BIC/SWIFT"
            v-bind="validateInfosIbanOthersModule.cb_iban_bic_swift"
          >
            <a-input
              v-model:value="formStateIbanOthers.cb_iban_bic_swift"
              @blur="validate('cb_iban_bic_swift', { trigger: 'blur' }).catch(() => { })"
            />
          </a-form-item>
          <a-form-item
            label="Pays du compte:"
            v-bind="validateInfosIbanOthersModule.cb_iban_account_country"
          >
            <a-select
              v-model:value="formStateIbanOthers.cb_iban_account_country"
              :options="countriesIbanOthers"
            />
          </a-form-item>
          <!-- end form items BIC SWIFT -->
          <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
            <a-button
              block
              type="primary"
              @click.prevent="onSubmitIbanModule"
            >
              Enregistrer
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
