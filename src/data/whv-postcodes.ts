export interface WHVPostcodeEntry {
  regionType: "remote" | "remote_additional" | "northern" | "regional"
  note_en: string
  note_ko: string
  postcodes: number[]
  ranges?: [number, number][]
}

export const WHV_POSTCODES: Record<string, WHVPostcodeEntry[]> = {
  NSW: [
    {
      regionType: "remote",
      note_en: "Remote and Very Remote Australia — tourism & hospitality eligible from 22 Jun 2021",
      note_ko: "Remote and Very Remote Australia — 2021년 6월 22일부터 관광·호스피탈리티 가능",
      postcodes: [2356, 2386, 2387, 2396, 2405, 2406, 2672, 2675, 2825, 2826, 2829, 2873, 2878, 2879, 2898, 2899],
      ranges: [[2832, 2836], [2838, 2840]],
    },
    {
      regionType: "regional",
      note_en: "Regional Australia — all specified work eligible",
      note_ko: "Regional Australia — 모든 지정 근무 가능",
      postcodes: [],
      ranges: [[2311, 2312], [2328, 2411], [2420, 2490], [2536, 2551], [2575, 2594], [2618, 2739], [2787, 2898]],
    },
  ],
  NT: [
    {
      regionType: "remote",
      note_en: "All postcodes in Northern Territory are eligible",
      note_ko: "노던 테러토리 모든 포스트코드 가능",
      postcodes: [],
      ranges: [],
    },
  ],
  QLD: [
    {
      regionType: "remote",
      note_en: "Remote and Very Remote Australia — tourism & hospitality eligible",
      note_ko: "Remote and Very Remote Australia — 관광·호스피탈리티 가능",
      postcodes: [4025, 4183, 4406, 4416, 4417, 4418, 4419, 4420, 4422, 4423, 4426, 4427, 4428, 4454, 4461, 4462, 4465, 4467, 4468, 4470, 4474, 4475, 4477, 4478, 4479, 4480, 4481, 4482, 4486, 4487, 4488, 4489, 4490, 4491, 4492, 4493, 4494, 4496, 4497, 4498, 4680, 4694, 4695, 4697, 4699, 4700, 4701, 4702, 4703, 4704, 4705, 4706, 4707, 4709, 4710, 4711, 4712, 4713, 4714, 4717, 4720, 4721, 4722, 4723, 4724, 4725, 4726, 4727, 4728, 4730, 4731, 4732, 4733, 4735, 4736, 4737, 4738, 4739, 4740, 4741, 4742, 4743, 4744, 4745, 4746, 4750, 4751, 4753, 4754, 4756, 4757, 4798, 4799, 4800, 4801, 4802, 4803, 4804, 4805, 4806, 4807, 4808, 4809, 4810, 4811, 4812, 4814, 4815, 4816, 4817, 4818, 4819, 4820, 4821, 4822, 4823, 4824, 4825, 4828, 4829, 4830, 4849, 4850, 4852, 4854, 4855, 4856, 4858, 4859, 4860, 4861, 4865, 4868, 4869, 4870, 4871, 4872, 4873, 4874, 4875, 4876, 4877, 4878, 4879, 4880, 4881, 4882, 4883, 4884, 4885, 4886, 4887, 4888, 4890, 4891, 4892, 4895],
      ranges: [],
    },
    {
      regionType: "remote_additional",
      note_en: "Additional Remote areas (from 1 Jul 2022)",
      note_ko: "추가 Remote 지역 (2022년 7월 1일부터)",
      postcodes: [4406, 4416, 4498],
      ranges: [],
    },
    {
      regionType: "northern",
      note_en: "Northern Australia — tourism & hospitality eligible from 22 Jun 2021",
      note_ko: "Northern Australia — 2021년 6월 22일부터 관광·호스피탈리티 가능",
      postcodes: [4472, 4478, 4481, 4482, 4680, 4694, 4695, 4697],
      ranges: [[4699, 4707], [4709, 4714], [4717, 4717], [4720, 4728], [4730, 4733], [4735, 4746], [4750, 4751], [4753, 4754], [4756, 4757], [4798, 4812], [4814, 4825], [4828, 4830], [4849, 4850], [4852, 4852], [4854, 4856], [4858, 4861], [4865, 4865], [4868, 4888], [4890, 4892], [4895, 4895]],
    },
    {
      regionType: "regional",
      note_en: "Regional Australia — all specified work eligible",
      note_ko: "Regional Australia — 모든 지정 근무 가능",
      postcodes: [4124, 4125, 4133, 4211],
      ranges: [[4270, 4272], [4275, 4275], [4280, 4280], [4285, 4285], [4287, 4287], [4307, 4499], [4510, 4510], [4512, 4512], [4515, 4519], [4522, 4899]],
    },
  ],
  VIC: [
    {
      regionType: "remote",
      note_en: "Remote and Very Remote Australia — tourism & hospitality eligible",
      note_ko: "Remote and Very Remote Australia — 관광·호스피탈리티 가능",
      postcodes: [3424, 3506, 3509, 3512],
      ranges: [[3889, 3892]],
    },
    {
      regionType: "regional",
      note_en: "Regional Australia — all specified work eligible",
      note_ko: "Regional Australia — 모든 지정 근무 가능",
      postcodes: [3139, 3753, 3756, 3758, 3762, 3764],
      ranges: [[3211, 3334], [3340, 3424], [3430, 3649], [3658, 3749], [3778, 3781], [3783, 3783], [3797, 3797], [3799, 3799], [3810, 3909], [3921, 3925], [3945, 3974], [3979, 3979], [3981, 3996]],
    },
  ],
  SA: [
    {
      regionType: "remote",
      note_en: "Remote and Very Remote Australia — tourism & hospitality eligible",
      note_ko: "Remote and Very Remote Australia — 관광·호스피탈리티 가능",
      postcodes: [5220, 5221, 5222, 5223, 5302, 5303, 5304, 5440, 5576, 5577, 5582, 5583, 5602, 5603, 5604, 5605, 5606, 5607, 5611, 5713, 5715, 5717, 5719, 5720, 5722, 5723, 5724, 5725],
      ranges: [[5630, 5633], [5640, 5642], [5650, 5655], [5660, 5661], [5670, 5671], [5680, 5680], [5690, 5690], [5730, 5734]],
    },
    {
      regionType: "regional",
      note_en: "All postcodes in South Australia are eligible",
      note_ko: "사우스 오스트레일리아 모든 포스트코드 가능",
      postcodes: [],
      ranges: [],
    },
  ],
  TAS: [
    {
      regionType: "remote",
      note_en: "Remote and Very Remote Australia — tourism & hospitality eligible",
      note_ko: "Remote and Very Remote Australia — 관광·호스피탈리티 가능",
      postcodes: [7139],
      ranges: [[7255, 7257], [7466, 7470]],
    },
    {
      regionType: "remote_additional",
      note_en: "Additional Remote areas (from 1 Jul 2022)",
      note_ko: "추가 Remote 지역 (2022년 7월 1일부터)",
      postcodes: [7215],
      ranges: [],
    },
    {
      regionType: "regional",
      note_en: "All postcodes in Tasmania are eligible",
      note_ko: "태즈메이니아 모든 포스트코드 가능",
      postcodes: [],
      ranges: [],
    },
  ],
  WA: [
    {
      regionType: "remote",
      note_en: "Remote and Very Remote Australia — tourism & hospitality eligible",
      note_ko: "Remote and Very Remote Australia — 관광·호스피탈리티 가능",
      postcodes: [6161, 6335, 6336, 6337, 6338, 6341, 6343, 6346, 6348, 6350, 6351, 6352, 6353, 6355, 6356, 6357, 6358, 6359, 6361, 6363, 6365, 6367, 6368, 6369, 6373, 6375, 6385, 6386, 6440, 6443, 6445, 6446, 6447, 6448, 6450, 6452, 6515, 6517, 6518, 6519, 6536, 6605, 6606, 6608, 6609, 6612, 6613, 6614, 6616, 6620, 6623, 6625, 6627, 6628, 6630, 6631, 6632, 6635, 6638, 6639, 6640, 6731, 6733, 6798, 6799],
      ranges: [[6418, 6429], [6431, 6431], [6434, 6434], [6436, 6438], [6466, 6468], [6470, 6470], [6472, 6473], [6475, 6477], [6479, 6480], [6484, 6484], [6487, 6490]],
    },
    {
      regionType: "northern",
      note_en: "Northern Australia — tourism & hospitality eligible from 22 Jun 2021",
      note_ko: "Northern Australia — 2021년 6월 22일부터 관광·호스피탈리티 가능",
      postcodes: [872, 6537, 6642, 6646, 6701, 6705, 6707, 6710, 6711, 6712, 6713, 6714, 6716, 6718, 6720, 6721, 6722, 6725, 6726, 6728, 6740, 6743, 6751, 6753, 6754, 6758, 6760, 6762, 6765, 6770],
      ranges: [],
    },
    {
      regionType: "regional",
      note_en: "Regional Australia — all specified work eligible",
      note_ko: "Regional Australia — 모든 지정 근무 가능",
      postcodes: [],
      ranges: [[6041, 6044], [6055, 6056], [6069, 6069], [6076, 6076], [6083, 6084], [6111, 6111], [6121, 6126], [6200, 6799]],
    },
  ],
}
