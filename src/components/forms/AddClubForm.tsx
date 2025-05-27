

// const AddClubForm = () => {




//   return (
//         <div className="p-6 space-y-6">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold">Crear Nuevo Club</h1>
//           </div>
  
//           <Card>
//             <CardContent className="p-6">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Nombre del Club *</Label>
//                   <Input
//                     id="name"
//                     required
//                     value={formData.name}
//                     onChange={(e) => handleInputChange("name", e.target.value)}
//                     placeholder="Ingresa el nombre de tu club"
//                   />
//                 </div>
  
//                 <div className="space-y-2">
//                   <Label htmlFor="description">Descripción *</Label>
//                   <Textarea
//                     id="description"
//                     required
//                     value={formData.description}
//                     onChange={(e) => handleInputChange("description", e.target.value)}
//                     placeholder="Describe tu club"
//                   />
//                 </div>
  
//                 <div className="space-y-2">
//                   <Label htmlFor="address">Dirección *</Label>
//                   <Input
//                     id="address"
//                     required
//                     value={formData.address}
//                     onChange={(e) => handleInputChange("address", e.target.value)}
//                     placeholder="Ingresa la dirección del club"
//                   />
//                 </div>
  
//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Teléfono *</Label>
//                   <Input
//                     id="phone"
//                     required
//                     value={formData.phone}
//                     onChange={(e) => handleInputChange("phone", e.target.value)}
//                     placeholder="Ingresa el teléfono de contacto"
//                   />
//                 </div>
  
//                 <Button 
//                   type="submit" 
//                   className="w-full"
//                   disabled={mutation.isPending}
//                 >
//                   {mutation.isPending ? "Creando..." : "Crear Club"}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
  
//           {showAlert && (
//             <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
//               {mutation.isSuccess ? (
//                 <div className="bg-gray-800 border border-green-500/20 rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md">
//                   <div className="flex items-start space-x-3">
//                     <div className="flex-shrink-0">
//                       <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
//                         <Building2 className="w-5 h-5 text-green-400" />
//                       </div>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-sm font-semibold text-green-400">¡Club creado exitosamente!</h3>
//                         <button
//                           onClick={() => setShowAlert(false)}
//                           className="text-gray-400 hover:text-white transition-colors"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                           </svg>
//                         </button>
//                       </div>
//                       <p className="text-sm text-gray-300 mt-1">Tu club ha sido creado y está pendiente de aprobación.</p>
//                     </div>
//                   </div>
//                   <div className="mt-3 w-full bg-gray-700 rounded-full h-1">
//                     <div className="bg-green-500 h-1 rounded-full animate-pulse" style={{ width: "100%" }} />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-gray-800 border border-red-500/20 rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md">
//                   <div className="flex items-start space-x-3">
//                     <div className="flex-shrink-0">
//                       <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
//                         <Building2 className="w-5 h-5 text-red-400" />
//                       </div>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-sm font-semibold text-red-400">Error al crear el club</h3>
//                         <button
//                           onClick={() => setShowAlert(false)}
//                           className="text-gray-400 hover:text-white transition-colors"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                           </svg>
//                         </button>
//                       </div>
//                       <p className="text-sm text-gray-300 mt-1">
//                         Hubo un problema al crear el club. Por favor, inténtalo de nuevo.
//                       </p>
//                     </div>
//                   </div>
//                   <div className="mt-3 w-full bg-gray-700 rounded-full h-1">
//                     <div className="bg-red-500 h-1 rounded-full animate-pulse" style={{ width: "100%" }} />
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )
  
// }

// export default AddClubForm