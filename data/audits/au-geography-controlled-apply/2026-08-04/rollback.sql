-- 10.9B AU Geography Controlled Apply -- Rollback Script
-- This script deletes ONLY the 41 rows inserted by the apply transaction.
-- DO NOT use blanket DELETE WHERE country_code = "AU".

BEGIN TRANSACTION;

-- Delete 41 inserted rows by exact UUID (deterministic from candidate key)
DELETE FROM core.geographies WHERE id = '40efec60-df13-307c-ea32-b8aaad10e2a8'::uuid; -- Albury (1001)
DELETE FROM core.geographies WHERE id = '0f25fa89-dd6f-b7a6-2517-ee046d0bc1c7'::uuid; -- Central Coast (1010)
DELETE FROM core.geographies WHERE id = '4fd6a0bf-d129-9fbc-fea8-ce97934435ab'::uuid; -- Coffs Harbour (1011)
DELETE FROM core.geographies WHERE id = '818d2d6f-c903-0a85-f326-984c9ed5c5d4'::uuid; -- Newcastle (1025)
DELETE FROM core.geographies WHERE id = '7835b24e-625d-0046-738f-3dbd4bc8c79f'::uuid; -- Port Macquarie (1028)
DELETE FROM core.geographies WHERE id = 'efe4c42f-cd2b-09bd-3834-624a53d2f9fb'::uuid; -- Sydney (1031)
DELETE FROM core.geographies WHERE id = '778332ea-dcbc-cceb-9eca-2c5ed50d1a93'::uuid; -- Wagga Wagga (1035)
DELETE FROM core.geographies WHERE id = 'a131c859-8ff2-880c-80e4-bc9b6ebc54c7'::uuid; -- Wollongong (1036)
DELETE FROM core.geographies WHERE id = '5d05724d-6d74-ab2c-e6e8-53997522bf18'::uuid; -- Ballarat (2003)
DELETE FROM core.geographies WHERE id = 'c9acc3d6-fbd1-585f-2710-b44079541558'::uuid; -- Bendigo (2004)
DELETE FROM core.geographies WHERE id = '90c71d50-1f99-33fc-356a-2f9be4255e74'::uuid; -- Geelong (2008)
DELETE FROM core.geographies WHERE id = '8f42442b-2645-0706-dcbe-60d804f96146'::uuid; -- Melbourne (2011)
DELETE FROM core.geographies WHERE id = '50fa2e3a-3879-6a02-66b2-2073526ae6c6'::uuid; -- Mildura (2012)
DELETE FROM core.geographies WHERE id = '0c2659f0-0b5c-f4b2-da08-cf20f9ee0537'::uuid; -- Shepparton (2016)
DELETE FROM core.geographies WHERE id = '1b389596-4b1f-96a1-5f33-e6d8f675402d'::uuid; -- Brisbane (3002)
DELETE FROM core.geographies WHERE id = '8c66a5dc-055d-dc21-ddbe-854ea146b9d0'::uuid; -- Bundaberg (3003)
DELETE FROM core.geographies WHERE id = '75c50f37-dfe9-1b56-db4b-8de3a2d70965'::uuid; -- Cairns (3004)
DELETE FROM core.geographies WHERE id = '874e520f-e8c6-362e-eb81-0f68e0a45997'::uuid; -- Gladstone (3006)
DELETE FROM core.geographies WHERE id = '3b3e3cfb-dddd-d4ad-8d3c-81adc783fb9b'::uuid; -- Gold Coast (3007)
DELETE FROM core.geographies WHERE id = 'fdfe40b4-3c36-16a0-e1c4-5d58e13de0cc'::uuid; -- Hervey Bay (3009)
DELETE FROM core.geographies WHERE id = '39da3c03-43f0-fdda-6168-20531b09b119'::uuid; -- Mackay (3011)
DELETE FROM core.geographies WHERE id = '7f33d502-a686-f2b8-6be8-7ec9e419814f'::uuid; -- Rockhampton (3014)
DELETE FROM core.geographies WHERE id = '1f51d3a1-a785-f2ca-9591-8af147809c9a'::uuid; -- Sunshine Coast (3015)
DELETE FROM core.geographies WHERE id = '555631da-b1dc-ad77-8e02-96c10fa90ddc'::uuid; -- Toowoomba (3016)
DELETE FROM core.geographies WHERE id = '65f97318-2f33-08f3-c20c-ff18610ad2c5'::uuid; -- Townsville (3017)
DELETE FROM core.geographies WHERE id = 'a0cbe90e-6bf8-3b39-d4b1-091e03a8e429'::uuid; -- Adelaide (4001)
DELETE FROM core.geographies WHERE id = 'dcf6f37b-89bc-2081-c6de-a7f4a4d7de27'::uuid; -- Bunbury (5003)
DELETE FROM core.geographies WHERE id = 'ce80bdf1-f6f6-bde4-1bd6-5b742663b96b'::uuid; -- Perth (5009)
DELETE FROM core.geographies WHERE id = '4ffe2f13-0b31-869e-c4b1-ba6c193bdeb3'::uuid; -- Hobart (6003)
DELETE FROM core.geographies WHERE id = 'f4b20b7f-ee15-fe53-b386-b04702f38e5c'::uuid; -- Launceston (6004)
DELETE FROM core.geographies WHERE id = '2a98dbca-f2d6-a626-9298-23d110b5d475'::uuid; -- Darwin (7002)
DELETE FROM core.geographies WHERE id = 'b234e544-e5bc-d117-e073-fe70c42202ef'::uuid; -- Canberra (8001)
DELETE FROM core.geographies WHERE id = 'c73f2a49-2fb8-9b61-d04e-f486697d39fc'::uuid; -- New South Wales (1)
DELETE FROM core.geographies WHERE id = '411b2ec1-c513-982d-d06a-62e38af6dfe6'::uuid; -- Victoria (2)
DELETE FROM core.geographies WHERE id = '8fd23322-0044-83a4-9167-0eeca98276aa'::uuid; -- Queensland (3)
DELETE FROM core.geographies WHERE id = 'd5d08946-72a0-1787-f88c-3d065d0cff70'::uuid; -- South Australia (4)
DELETE FROM core.geographies WHERE id = '0d3b20b8-aed3-5f35-e197-b19f7cf8d09e'::uuid; -- Western Australia (5)
DELETE FROM core.geographies WHERE id = '0da64182-5219-b32e-9642-b2e88614aec6'::uuid; -- Tasmania (6)
DELETE FROM core.geographies WHERE id = '740997dc-1f14-a501-db89-9f22f5ac38e6'::uuid; -- Northern Territory (7)
DELETE FROM core.geographies WHERE id = '25398693-0618-8200-f387-e9bec239a0cb'::uuid; -- Australian Capital Territory (8)
DELETE FROM core.geographies WHERE id = '3adb4116-3deb-ac2f-57e1-09ea82c98e17'::uuid; -- Other Territories (9)

-- Verification: 41 rows should have been deleted
-- (9 regions + 32 cities)

-- Rollback verification query:
SELECT COUNT(*) AS remaining_au_new_rows FROM core.geographies
WHERE id IN (
    '40efec60-df13-307c-ea32-b8aaad10e2a8'::uuid,
    '0f25fa89-dd6f-b7a6-2517-ee046d0bc1c7'::uuid,
    '4fd6a0bf-d129-9fbc-fea8-ce97934435ab'::uuid,
    '818d2d6f-c903-0a85-f326-984c9ed5c5d4'::uuid,
    '7835b24e-625d-0046-738f-3dbd4bc8c79f'::uuid,
    'efe4c42f-cd2b-09bd-3834-624a53d2f9fb'::uuid,
    '778332ea-dcbc-cceb-9eca-2c5ed50d1a93'::uuid,
    'a131c859-8ff2-880c-80e4-bc9b6ebc54c7'::uuid,
    '5d05724d-6d74-ab2c-e6e8-53997522bf18'::uuid,
    'c9acc3d6-fbd1-585f-2710-b44079541558'::uuid,
    '90c71d50-1f99-33fc-356a-2f9be4255e74'::uuid,
    '8f42442b-2645-0706-dcbe-60d804f96146'::uuid,
    '50fa2e3a-3879-6a02-66b2-2073526ae6c6'::uuid,
    '0c2659f0-0b5c-f4b2-da08-cf20f9ee0537'::uuid,
    '1b389596-4b1f-96a1-5f33-e6d8f675402d'::uuid,
    '8c66a5dc-055d-dc21-ddbe-854ea146b9d0'::uuid,
    '75c50f37-dfe9-1b56-db4b-8de3a2d70965'::uuid,
    '874e520f-e8c6-362e-eb81-0f68e0a45997'::uuid,
    '3b3e3cfb-dddd-d4ad-8d3c-81adc783fb9b'::uuid,
    'fdfe40b4-3c36-16a0-e1c4-5d58e13de0cc'::uuid,
    '39da3c03-43f0-fdda-6168-20531b09b119'::uuid,
    '7f33d502-a686-f2b8-6be8-7ec9e419814f'::uuid,
    '1f51d3a1-a785-f2ca-9591-8af147809c9a'::uuid,
    '555631da-b1dc-ad77-8e02-96c10fa90ddc'::uuid,
    '65f97318-2f33-08f3-c20c-ff18610ad2c5'::uuid,
    'a0cbe90e-6bf8-3b39-d4b1-091e03a8e429'::uuid,
    'dcf6f37b-89bc-2081-c6de-a7f4a4d7de27'::uuid,
    'ce80bdf1-f6f6-bde4-1bd6-5b742663b96b'::uuid,
    '4ffe2f13-0b31-869e-c4b1-ba6c193bdeb3'::uuid,
    'f4b20b7f-ee15-fe53-b386-b04702f38e5c'::uuid,
    '2a98dbca-f2d6-a626-9298-23d110b5d475'::uuid,
    'b234e544-e5bc-d117-e073-fe70c42202ef'::uuid,
    'c73f2a49-2fb8-9b61-d04e-f486697d39fc'::uuid,
    '411b2ec1-c513-982d-d06a-62e38af6dfe6'::uuid,
    '8fd23322-0044-83a4-9167-0eeca98276aa'::uuid,
    'd5d08946-72a0-1787-f88c-3d065d0cff70'::uuid,
    '0d3b20b8-aed3-5f35-e197-b19f7cf8d09e'::uuid,
    '0da64182-5219-b32e-9642-b2e88614aec6'::uuid,
    '740997dc-1f14-a501-db89-9f22f5ac38e6'::uuid,
    '25398693-0618-8200-f387-e9bec239a0cb'::uuid,
    '3adb4116-3deb-ac2f-57e1-09ea82c98e17'::uuid);
-- Expected count: 0

COMMIT;

-- Note: This rollback script is NOT auto-executed. Requires explicit human approval.
-- DO NOT delete existing AU city rows (19 pre-existing cities) -- they are NOT in this rollback list.