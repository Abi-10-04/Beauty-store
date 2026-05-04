// Import all product images
// Skincare images
import AntiAgingCream from '../assets/images/Anti_Aging_Cream.jpg'
import AloeVeraGel from '../assets/images/Aloe_Vera_Gel.jpg'
import BodyLotion from '../assets/images/Body_Lotion.jpg'
import EyeCream from '../assets/images/Eye_Cream.jpg'
import FaceWash from '../assets/images/Face_wash.jpg'
import FaceScrub from '../assets/images/Face_Scrub.jpg'
import HandCream from '../assets/images/Hand_Cream.jpg'
import Toner from '../assets/images/Toner.jpg'
import SheetMask from '../assets/images/Sheet_Mask.jpg'
import LipBalm from '../assets/images/Lip_Balm.jpg'
import DarkCircleCream from '../assets/images/Dark_Circle_Cream.jpg'
import FaceSerum from '../assets/images/Face_Serum.jpg'
import NightFaceMask from '../assets/images/Night_Face_Mask.jpg'
import Sunscreen from '../assets/images/Sunscreen_SPF_50.jpg'
import VitaminCSerum from '../assets/images/Vitamin_C_Serum.jpg'
import FaceCleanser from '../assets/images/Face_Cleanser.jpg'
import MoisturizingCream from '../assets/images/Moisturizing_Cream.jpg'

// Haircare images
import AntiDandruffShampoo from '../assets/images/Anti-Dandruff_Shampoo.jpg'
import ColorProtectionShampoo from '../assets/images/Color_Protection_Shampoo.jpg'
import HairGrowthOil from '../assets/images/Hair_Growth_Oil.jpg'
import HairMousse from '../assets/images/Hair_Mousse.jpg'
import HairOil from '../assets/images/Hair_Oil.jpg'
import HairWax from '../assets/images/Hair_Wax.jpg'
import HeatProtectantSpray from '../assets/images/Heat_Protectant_Spray.jpg'
import KeratingTreatmentCream from '../assets/images/Keratin_Treatment_Cream.jpg'
import LeaveInConditioner from '../assets/images/Leave-in_Conditioner.jpg'
import ScalpTreatment from '../assets/images/Scalp_Treatment.jpg'
import RosemaryOil from '../assets/images/Rosemary_Oil.jpg'
import Rosemarywater from '../assets/images/Rosemary_Water.jpg'
import HairMask from '../assets/images/Hair_Mask.jpg'
import HairShampoo from '../assets/images/Hair_Shampoo.jpg'
import HairSpray from '../assets/images/Hair_Spray.jpg'
import HairSerum from '../assets/images/Hair_Serum.jpg'
import HairConditioner from '../assets/images/Hair_Conditioner.jpg'

// Makeup images
import Bronzer from '../assets/images/Bronzer.jpg'
import BrowPencil from '../assets/images/Brow_Pencil.jpg'
import CompactPowder from '../assets/images/Compact_Powder.jpg'
import Concealer from '../assets/images/Concealer.jpg'
import EyeshadowPalette from '../assets/images/Eyeshadow_Palette.jpg'
import Highlighter from '../assets/images/Highlighter.jpg'
import Kajal from '../assets/images/Kajal.jpg'
import LipGloss from '../assets/images/Lip_Gloss.jpg'
import MakeupSettingSpray from '../assets/images/Makeup_Setting_Spray.jpg'
import Primer from '../assets/images/Primer.jpg'
import Mascara from '../assets/images/Mascara.jpg'
import Lipstick from '../assets/images/Lipstick.jpg'
import Blush from '../assets/images/Blush.jpg'
import Eyeliner from '../assets/images/Eyeliner.jpg'
import Foundation from '../assets/images/Foundation.jpg'
import LipLiner from '../assets/images/Lip_Liner.jpg'

// Map product names to images
export const imageMap = {
  // Skincare products
  'Anti-aging Cream': AntiAgingCream,
  'Aloe Vera Gel': AloeVeraGel,
  'Body Lotion': BodyLotion,
  'Eye Cream': EyeCream,
  'Face Wash': FaceWash,
  'Face Scrub': FaceScrub,
  'Hand Cream': HandCream,
  'Toner': Toner,
  'Sheet Mask': SheetMask,
  'Lip Balm': LipBalm,
  'Dark Circle Cream': DarkCircleCream,
  'Face Serum': FaceSerum,
  'Night Face Mask': NightFaceMask, 
  'Sunscreen SPF 50': Sunscreen,
  'Vitamin C Serum': VitaminCSerum,
  'Face Cleanser': FaceCleanser,
  'Moisturizing Cream': MoisturizingCream,  

  // Haircare products
  'Anti-Dandruff Shampoo': AntiDandruffShampoo,
  'Color Protection Shampoo': ColorProtectionShampoo,
  'Hair Growth Oil': HairGrowthOil,
  'Hair Mousse': HairMousse,
  'Hair Oil': HairOil,
  'Hair Wax': HairWax,
  'Heat Protectant Spray': HeatProtectantSpray,
  'Keratin Treatment Cream': KeratingTreatmentCream,
  'Leave-in Conditioner': LeaveInConditioner,
  'Scalp Treatment': ScalpTreatment,
  'Hair Mask': HairMask,
  'Rosemary Oil': RosemaryOil,
  'Rosemary water': Rosemarywater,
  'Shampoo': HairShampoo,
  'Hair Spray': HairSpray,
  'Hair Serum': HairSerum,
  'Hair Conditioner': HairConditioner,

  // Makeup products
  'Bronzer': Bronzer,
  'Brow Pencil': BrowPencil,
  'Compact Powder': CompactPowder,
  'Concealer': Concealer,
  'Eyeshadow Palette': EyeshadowPalette,
  'Highlighter': Highlighter,
  'Kajal': Kajal,
  'Lip Gloss': LipGloss,
  'Makeup Setting Spray': MakeupSettingSpray,
  'Primer': Primer,
  'Mascara': Mascara,
  'Lipstick': Lipstick,
  'Blush': Blush,
  'Eyeliner': Eyeliner,
  'Foundation': Foundation,
  'Lip Liner': LipLiner,
}

// Function to get image for product
export const getProductImage = (productName) => {
  return imageMap[productName] || null
}
