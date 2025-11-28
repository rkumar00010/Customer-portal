import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Building2, MapPin, Plus, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { bookingsData } from '../utils/bookingsData';

export default function BookingsTab() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Use bookings data from shared file
  const bookings = bookingsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl">My Bookings</h2>
          <p className="text-gray-400 mt-1">View and manage your property bookings</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
              <DialogDescription>Fill in the details to create a new property booking</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select>
                    <SelectTrigger id="project" className="rounded-full bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="sky-tower">Sky Tower</SelectItem>
                      <SelectItem value="green-valley">Green Valley</SelectItem>
                      <SelectItem value="ocean-view">Ocean View Residency</SelectItem>
                      <SelectItem value="urban-square">Urban Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit Number</Label>
                  <Input id="unit" placeholder="e.g., 401" className="rounded-full bg-gray-800 border-gray-700" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Property Type</Label>
                  <Select>
                    <SelectTrigger id="type" className="rounded-full bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="1bhk">1BHK Apartment</SelectItem>
                      <SelectItem value="2bhk">2BHK Apartment</SelectItem>
                      <SelectItem value="3bhk">3BHK Apartment</SelectItem>
                      <SelectItem value="4bhk">4BHK Apartment</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (sq ft)</Label>
                  <Input id="area" placeholder="e.g., 1850" type="number" className="rounded-full bg-gray-800 border-gray-700" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Property Price</Label>
                <Input id="price" placeholder="e.g., 850000" type="number" className="rounded-full bg-gray-800 border-gray-700" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your full name" className="rounded-full bg-gray-800 border-gray-700" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="rounded-full bg-gray-800 border-gray-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+1 234 567 8900" className="rounded-full bg-gray-800 border-gray-700" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 rounded-full border-gray-700 hover:bg-gray-800">
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)} className="flex-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Submit Booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="bg-gray-900/50 border-gray-800 backdrop-blur-xl overflow-hidden hover:border-gray-700 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
            {/* Property Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={booking.image} 
                alt={booking.propertyName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              <Badge className={`absolute top-4 right-4 rounded-full ${
                booking.status === 'active' 
                  ? 'bg-green-500/90 text-white border-green-500' 
                  : 'bg-blue-500/90 text-white border-blue-500'
              }`}>
                {booking.status}
              </Badge>
              <div className="absolute bottom-4 left-4">
                <CardTitle className="text-white">{booking.propertyName}</CardTitle>
                <CardDescription className="text-gray-200">Unit {booking.unit}</CardDescription>
              </div>
            </div>

            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-xs">Type</p>
                    <p className="text-white text-sm">{booking.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-xs">Location</p>
                    <p className="text-white text-sm">{booking.location}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                <div>
                  <p className="text-gray-400 text-xs">Area</p>
                  <p className="text-white">{booking.area}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Price</p>
                  <p className="text-white">₹{(booking.price / 10000000).toFixed(2)} Cr</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs">Booking Date</p>
                  <p className="text-white text-sm">{booking.bookingDate}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Possession</p>
                  <p className="text-white text-sm">{booking.possession}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => navigate(`/bookings/${booking.bookingId}`)}
                  variant="outline" 
                  className="flex-1 rounded-full border-gray-700 hover:bg-gray-800 hover:text-white"
                >
                  View Details
                </Button>
                <Button className="flex-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Make Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State for demonstration */}
      {bookings.length === 0 && (
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-gray-800/50 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-white text-xl mb-2">No Bookings Yet</h3>
            <p className="text-gray-400 text-center mb-6">Start your journey by creating your first property booking</p>
            <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New Booking
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
